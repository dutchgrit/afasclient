using System.Net.Http;
using System.Threading.Tasks;

namespace DutchGrit.Afas.Auth
{
    /// <summary>
    /// Strategy that supplies the value for the Authorization header.
    /// Requested asynchronously so OAuth tokens (Client Credentials flow) can be
    /// retrieved and automatically refreshed before they expire.
    /// </summary>
    public interface IAfasAuthentication
    {
        /// <summary>
        /// Returns the full Authorization header value, for example
        /// "AfasToken &lt;base64&gt;" or "Bearer &lt;access_token&gt;".
        /// </summary>
        /// <param name="httpClient">The shared HttpClient, reusable for retrieving a token.</param>
        /// <param name="baseUrl">The REST base URL of the environment, ending with a slash (including profitrestservices/).</param>
        Task<string> GetAuthorizationHeaderAsync(HttpClient httpClient, string baseUrl);
    }
}
