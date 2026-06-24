using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas.Auth
{
    /// <summary>
    /// Classic token authenticatie. Het AFAS-token wordt naar Base64 geconverteerd en met
    /// de "AfasToken"-prefix als Authorization-header gebruikt.
    /// Let op: deze methode komt per 01-09-2027 te vervallen; gebruik bij voorkeur OAuth.
    /// </summary>
    public class ClassicTokenAuthentication : IAfasAuthentication
    {
        private readonly string headerValue;

        public ClassicTokenAuthentication(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                throw new ArgumentException("Token mag niet leeg zijn.", nameof(token));

            // Converteer het token naar Base64 en zet er de AfasToken-prefix voor.
            var authToken = Encoding.ASCII.GetBytes(token);
            this.headerValue = "AfasToken " + Convert.ToBase64String(authToken);
        }

        public Task<string> GetAuthorizationHeaderAsync(HttpClient httpClient, string baseUrl)
        {
            return Task.FromResult(this.headerValue);
        }
    }
}
