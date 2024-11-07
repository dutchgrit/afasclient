using Newtonsoft.Json;

namespace DutchGrit.Afas.DTO
{
    public class OtpValidationResponse
    {
        [JsonProperty("token")]
        public string Token { get; set; }
    }
}
