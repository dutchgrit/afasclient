using Newtonsoft.Json;

namespace DutchGrit.Afas.DTO
{
    /// <summary>
    /// Response van het OAuth token endpoint.
    /// Bij de Client Credentials flow is refresh_token altijd null.
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
