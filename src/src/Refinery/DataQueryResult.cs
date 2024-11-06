using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas.Refinery
{
    public class DataQueryResult<T>
    {
        [JsonProperty("rows")]
        public T[] Rows { get; set; }
    }
}
