using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace DutchGrit.Afas.Auth
{
    /// <summary>
    /// Authenticatie met een vooraf verkregen OAuth access token. De consument is zelf
    /// verantwoordelijk voor het verkrijgen en (eventueel) verversen van het token.
    /// Geschikt voor tokens uit de Authorization Code flow (PKCE) of een eigen tokenbeheer.
    /// </summary>
    public class BearerTokenAuthentication : IAfasAuthentication
    {
        private readonly string headerValue;

        public BearerTokenAuthentication(string accessToken)
        {
            if (string.IsNullOrWhiteSpace(accessToken))
                throw new ArgumentException("Access token mag niet leeg zijn.", nameof(accessToken));

            this.headerValue = "Bearer " + accessToken;
        }

        public Task<string> GetAuthorizationHeaderAsync(HttpClient httpClient, string baseUrl)
        {
            return Task.FromResult(this.headerValue);
        }
    }
}
