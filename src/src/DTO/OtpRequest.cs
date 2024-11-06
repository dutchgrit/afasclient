using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas.DTO
{
    public class OtpRequest
    {

        [JsonProperty("apiKey")]
        public string ApiKey { get; set; }

        [JsonProperty("userid")]
        public string UserId { get; set; }

        [JsonProperty("apiToken")]
        public string ApiToken { get; set; }
    
    }

}
