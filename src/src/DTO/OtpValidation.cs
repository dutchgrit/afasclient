using Newtonsoft.Json;

namespace DutchGrit.Afas.DTO
{
    class OtpValidation : OtpRequest
    {

        [JsonProperty("Otp")]
        public string OTP { get; set; }

    }


}
