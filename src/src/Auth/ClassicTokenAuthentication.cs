using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas.Auth
{
    /// <summary>
    /// Classic token authentication. The AFAS token is converted to Base64 and used as the
    /// Authorization header with the "AfasToken" prefix.
    /// Note: AFAS is phasing out classic tokens. Existing tokens expire on 1 May 2027, and app connectors that use
    /// a classic token stop working after 31 August 2027; prefer using OAuth.
    /// </summary>
    public class ClassicTokenAuthentication : IAfasAuthentication
    {
        private readonly string headerValue;

        public ClassicTokenAuthentication(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                throw new ArgumentException("Token cannot be empty.", nameof(token));

            // Convert the token to Base64 and prefix it with "AfasToken".
            var authToken = Encoding.ASCII.GetBytes(token);
            this.headerValue = "AfasToken " + Convert.ToBase64String(authToken);
        }

        public Task<string> GetAuthorizationHeaderAsync(HttpClient httpClient, string baseUrl)
        {
            return Task.FromResult(this.headerValue);
        }
    }
}
