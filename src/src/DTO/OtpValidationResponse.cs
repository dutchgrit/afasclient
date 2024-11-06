using Newtonsoft.Json;

namespace DutchGrit.Afas.DTO
{
    public class OtpValidationResponse
    {
        [JsonProperty("token")]
        public string Token { get; set; }


        /// <summary>
        /// This field is used by Refinery only.
        /// </summary>
        [JsonProperty("appUID")]
        public string appUID { get; set; }
    }


}
