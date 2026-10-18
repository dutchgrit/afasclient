using DutchGrit.Afas.DTO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace DutchGrit.Afas.Auth
{
    /// <summary>
    /// OAuth Client Credentials flow (server-to-server). Retrieves an access token from the
    /// token endpoint and caches it until shortly before it expires. When a token has (nearly)
    /// expired, a new token is automatically retrieved.
    /// </summary>
    public class ClientCredentialsAuthentication : IAfasAuthentication
    {
        // A token is considered expired a margin before its actual expiry, so that a token that is only
        // just valid does not expire during the request itself: 25% of its lifetime, at most 60 seconds.
        private const double ExpiryMarginFraction = 0.25;
        private const double MaxExpiryMarginSeconds = 60;

        // Only a well-formed OAuth error code is copied into an exception message, never other response content.
        private static readonly Regex OAuthErrorCodePattern = new Regex(@"^[A-Za-z0-9_.\-]{1,64}\z", RegexOptions.CultureInvariant);

        private readonly string clientId;
        private readonly string clientSecret;
        private readonly SemaphoreSlim tokenLock = new SemaphoreSlim(1, 1);

        // Header value and expiry live in one immutable object, so a concurrent reader never sees a half-updated cache.
        private volatile CachedToken cachedToken;

        public ClientCredentialsAuthentication(string clientId, string clientSecret)
        {
            if (string.IsNullOrWhiteSpace(clientId))
                throw new ArgumentException("Client id cannot be empty.", nameof(clientId));
            if (string.IsNullOrWhiteSpace(clientSecret))
                throw new ArgumentException("Client secret cannot be empty.", nameof(clientSecret));

            this.clientId = clientId;
            this.clientSecret = clientSecret;
        }

        // Clock for the token cache; replaced in tests.
        internal Func<DateTimeOffset> UtcNow { get; set; } = () => DateTimeOffset.UtcNow;

        public async Task<string> GetAuthorizationHeaderAsync(HttpClient httpClient, string baseUrl)
        {
            // Fast path: token is still valid within the margin.
            var cached = this.cachedToken;
            if (cached != null && this.UtcNow() < cached.ValidUntil)
            {
                return cached.HeaderValue;
            }

            await this.tokenLock.WaitAsync().ConfigureAwait(false);
            try
            {
                // Double-check: another request may have already refreshed the token in the meantime.
                cached = this.cachedToken;
                if (cached != null && this.UtcNow() < cached.ValidUntil)
                {
                    return cached.HeaderValue;
                }

                // Taken before the request: the lifetime of the token cannot start any earlier.
                var requestedAt = this.UtcNow();
                var token = await RequestTokenAsync(httpClient, baseUrl).ConfigureAwait(false);
                var headerValue = "Bearer " + token.AccessToken;

                // A token without a positive lifetime is not cached; the next call retrieves a new one.
                this.cachedToken = token.ExpiresIn > 0
                    ? new CachedToken(headerValue, requestedAt.AddSeconds(token.ExpiresIn - ExpiryMargin(token.ExpiresIn)))
                    : null;

                return headerValue;
            }
            finally
            {
                this.tokenLock.Release();
            }
        }

        private static double ExpiryMargin(int expiresIn)
        {
            return Math.Min(expiresIn * ExpiryMarginFraction, MaxExpiryMarginSeconds);
        }

        private async Task<OAuthTokenResponse> RequestTokenAsync(HttpClient httpClient, string baseUrl)
        {
            var tokenEndpoint = baseUrl + "oauth/token";

            var body = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("client_id", this.clientId),
                new KeyValuePair<string, string>("client_secret", this.clientSecret)
            });

            using (var httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, tokenEndpoint) { Content = body })
            using (var res = await httpClient.SendAsync(httpRequestMessage).ConfigureAwait(false))
            {
                var content = await res.Content.ReadAsStringAsync().ConfigureAwait(false);
                if (!res.IsSuccessStatusCode)
                {
                    // Only the status and the OAuth error code: the body may contain details or echoed input
                    // that do not belong in logs.
                    throw new HttpRequestException(
                        $"Failed to retrieve OAuth access token (HTTP {(int)res.StatusCode}, error: {ReadOAuthErrorCode(content)}).");
                }

                var token = TryDeserializeToken(content);
                if (token == null || string.IsNullOrWhiteSpace(token.AccessToken))
                {
                    throw new HttpRequestException("The token endpoint did not return a valid access token.");
                }

                return token;
            }
        }

        private static string ReadOAuthErrorCode(string content)
        {
            try
            {
                var error = JObject.Parse(content)["error"] as JValue;
                var code = error?.Value as string;
                if (code != null && OAuthErrorCodePattern.IsMatch(code))
                {
                    return code;
                }
            }
            catch (JsonException)
            {
                // Not a JSON object: no error code to report.
            }

            return "unknown";
        }

        private static OAuthTokenResponse TryDeserializeToken(string content)
        {
            // A parse error is not passed on: its message can contain part of the response.
            try
            {
                return JsonConvert.DeserializeObject<OAuthTokenResponse>(content);
            }
            catch (JsonException)
            {
                return null;
            }
        }

        private sealed class CachedToken
        {
            public CachedToken(string headerValue, DateTimeOffset validUntil)
            {
                this.HeaderValue = headerValue;
                this.ValidUntil = validUntil;
            }

            public string HeaderValue { get; }

            public DateTimeOffset ValidUntil { get; }
        }
    }
}
