using System.Net.Http;
using System.Threading.Tasks;

namespace DutchGrit.Afas.Auth
{
    /// <summary>
    /// Strategie die de waarde voor de Authorization-header levert.
    /// Wordt async opgevraagd zodat OAuth-tokens (Client Credentials flow) opgehaald
    /// en automatisch ververst kunnen worden vóór ze verlopen.
    /// </summary>
    public interface IAfasAuthentication
    {
        /// <summary>
        /// Geeft de volledige Authorization-headerwaarde terug, bijvoorbeeld
        /// "AfasToken &lt;base64&gt;" of "Bearer &lt;access_token&gt;".
        /// </summary>
        /// <param name="httpClient">De gedeelde HttpClient, herbruikbaar voor het ophalen van een token.</param>
        /// <param name="baseUrl">De REST base-URL van de omgeving, eindigend op een slash (incl. profitrestservices/).</param>
        Task<string> GetAuthorizationHeaderAsync(HttpClient httpClient, string baseUrl);
    }
}
