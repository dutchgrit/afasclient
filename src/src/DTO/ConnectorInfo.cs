using Newtonsoft.Json;

namespace DutchGrit.Afas
{
    public class ConnectorInfo
    {

        [JsonProperty("id", Required=Required.Always)]
        public string Id { get; set; }

        [JsonProperty("description", Required = Required.Always)]
        public string Description { get; set; }
    }


}
