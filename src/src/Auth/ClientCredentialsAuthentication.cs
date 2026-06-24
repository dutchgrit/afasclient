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
    /// OAuth Client Credentials flow (server-to-server). Haalt een access token op bij het
    /// token endpoint en cachet dit tot vlak voor de vervaltijd. Bij een (bijna) verlopen
    /// token wordt automatisch een nieuw token opgehaald.
    /// </summary>
    public class ClientCredentialsAuthentication : IAfasAuthentication
    {
        // Marge in seconden waarmee een token als verlopen wordt beschouwd, om te voorkomen
        // dat een net-nog-geldig token tijdens de request alsnog verloopt.
        private const int VervalMargeSeconden = 60;

        private readonly string clientId;
        private readonly string clientSecret;
        private readonly SemaphoreSlim tokenLock = new SemaphoreSlim(1, 1);

        private string cachedHeaderValue;
        private DateTimeOffset vervaltMoment = DateTimeOffset.MinValue;

        public ClientCredentialsAuthentication(string clientId, string clientSecret)
        {
            if (string.IsNullOrWhiteSpace(clientId))
                throw new ArgumentException("Client id mag niet leeg zijn.", nameof(clientId));
            if (string.IsNullOrWhiteSpace(clientSecret))
                throw new ArgumentException("Client secret mag niet leeg zijn.", nameof(clientSecret));

            this.clientId = clientId;
            this.clientSecret = clientSecret;
        }

        public async Task<string> GetAuthorizationHeaderAsync(HttpClient httpClient, string baseUrl)
        {
            // Snel pad: token nog geldig binnen de marge.
            if (this.cachedHeaderValue != null && DateTimeOffset.UtcNow < this.vervaltMoment)
            {
                return this.cachedHeaderValue;
            }

            await this.tokenLock.WaitAsync().ConfigureAwait(false);
            try
            {
                // Dubbele controle: een ander request kan het token ondertussen al hebben ververst.
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
                        $"Ophalen OAuth access token mislukt ({(int)res.StatusCode} {res.StatusCode}): {content}");
                }

                var token = JsonConvert.DeserializeObject<OAuthTokenResponse>(content);
                if (token == null || string.IsNullOrWhiteSpace(token.AccessToken))
                {
                    throw new HttpRequestException("Het token endpoint gaf geen geldig access token terug.");
                }

                return token;
            }
        }
    }
}
