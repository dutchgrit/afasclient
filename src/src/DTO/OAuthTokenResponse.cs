using Newtonsoft.Json;

namespace DutchGrit.Afas.DTO
{
    /// <summary>
    /// Response from the OAuth token endpoint.
    /// With the Client Credentials flow, refresh_token is always null.
    /// </summary>
    public class OAuthTokenResponse
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }

        [JsonProperty("refresh_token")]
        public string RefreshToken { get; set; }

        [JsonProperty("token_type")]
        public string TokenType { get; set; }

        [JsonProperty("expires_in")]
        public int ExpiresIn { get; set; }
    }
}
