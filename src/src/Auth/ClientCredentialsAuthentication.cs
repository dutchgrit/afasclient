using DutchGrit.Afas.DTO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
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
        // Margin in seconds within which a token is considered expired, to prevent a
        // token that is only just valid from expiring during the request itself.
        private const int VervalMargeSeconden = 60;

        private readonly string clientId;
        private readonly string clientSecret;
        private readonly SemaphoreSlim tokenLock = new SemaphoreSlim(1, 1);

        private string cachedHeaderValue;
        private DateTimeOffset vervaltMoment = DateTimeOffset.MinValue;

        public ClientCredentialsAuthentication(string clientId, string clientSecret)
        {
            if (string.IsNullOrWhiteSpace(clientId))
                throw new ArgumentException("Client id cannot be empty.", nameof(clientId));
            if (string.IsNullOrWhiteSpace(clientSecret))
                throw new ArgumentException("Client secret cannot be empty.", nameof(clientSecret));

            this.clientId = clientId;
            this.clientSecret = clientSecret;
        }

        public async Task<string> GetAuthorizationHeaderAsync(HttpClient httpClient, string baseUrl)
        {
            // Fast path: token is still valid within the margin.
            if (this.cachedHeaderValue != null && DateTimeOffset.UtcNow < this.vervaltMoment)
            {
                return this.cachedHeaderValue;
            }

            await this.tokenLock.WaitAsync().ConfigureAwait(false);
            try
            {
                // Double-check: another request may have already refreshed the token in the meantime.
                if (this.cachedHeaderValue != null && DateTimeOffset.UtcNow < this.vervaltMoment)
                {
                    return this.cachedHeaderValue;
                }

                var token = await RequestTokenAsync(httpClient, baseUrl).ConfigureAwait(false);

                this.cachedHeaderValue = "Bearer " + token.AccessToken;
                this.vervaltMoment = DateTimeOffset.UtcNow.AddSeconds(Math.Max(0, token.ExpiresIn - VervalMargeSeconden));

                return this.cachedHeaderValue;
            }
            finally
            {
                this.tokenLock.Release();
            }
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
                    throw new HttpRequestException(
                        $"Failed to retrieve OAuth access token ({(int)res.StatusCode} {res.StatusCode}): {content}");
                }

                var token = JsonConvert.DeserializeObject<OAuthTokenResponse>(content);
                if (token == null || string.IsNullOrWhiteSpace(token.AccessToken))
                {
                    throw new HttpRequestException("The token endpoint did not return a valid access token.");
                }

                return token;
            }
        }
    }
}
