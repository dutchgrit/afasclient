using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas
{
    public class SessionInfo
    {


        [JsonProperty("updateConnectors", Required = Required.Default)]
        public ConnectorInfo[] UpdateConnectors { get; set; }

        [JsonProperty("getConnectors", Required = Required.Default)]
        public ConnectorInfo[] GetConnectors { get; set; }

        [JsonProperty("info", Required = Required.Always)]
        public SessionInfoDetails Info { get; set; }
    }

}
