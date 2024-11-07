using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas
{
    class AfasVersion
    {

        [JsonProperty("version", Required=Required.Always)]
        public string Version { get; set; }
    }


}
