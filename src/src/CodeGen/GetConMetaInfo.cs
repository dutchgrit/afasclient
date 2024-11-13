using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas
{
    public class GetConMetaInfo
    {
        [JsonProperty("fields", Required = Required.Always)]
        public GetConMetaInfoField[] Fields { get; set; }

        [JsonProperty("name", Required = Required.Always)]
        public string Name { get; set; }

        [JsonProperty("description", Required = Required.Always)]
        public string Description { get; set; }
    }
}
