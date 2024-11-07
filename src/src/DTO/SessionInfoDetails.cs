using Newtonsoft.Json;

namespace DutchGrit.Afas
{
    public class SessionInfoDetails
    {
        [JsonProperty("envid",Required = Required.Always)]
        public string EnvironmentID { get; set; }

        [JsonProperty("appName", Required = Required.Always)]
        public string ApplicationName { get; set; }

        [JsonProperty("group", Required = Required.Always)]
        public string Group { get; set; }

        [JsonProperty("tokenExpiry", Required = Required.Default)]
        public string TokenExpiry { get; set; }

    }


}
