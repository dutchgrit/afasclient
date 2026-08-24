using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace DutchGrit.Afas.Auth
{
    /// <summary>
    /// Authentication using a previously obtained OAuth access token. The consumer is
    /// responsible for obtaining and (optionally) refreshing the token themselves.
    /// Suitable for tokens from the Authorization Code flow (PKCE) or custom token management.
    /// </summary>
    public class BearerTokenAuthentication : IAfasAuthentication
    {
        private readonly string headerValue;

        public BearerTokenAuthentication(string accessToken)
        {
            if (string.IsNullOrWhiteSpace(accessToken))
                throw new ArgumentException("Access token cannot be empty.", nameof(accessToken));

            this.headerValue = "Bearer " + accessToken;
        }

        public Task<string> GetAuthorizationHeaderAsync(HttpClient httpClient, string baseUrl)
        {
            return Task.FromResult(this.headerValue);
        }
    }
}
