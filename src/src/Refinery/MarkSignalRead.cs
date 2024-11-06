using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;

namespace DutchGrit.Afas.Refinery
{

    /// </summary>
    [ConnectorName("MarkSignalRead")]
    public class MarkSignalRead : IDataEntity
    {

        [JsonProperty("SignalId")]
        public int SignalId { get; set; }
    }
}
