using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas
{
    public class QueryResult<T>
    {

        [JsonProperty("skip", Required=Required.Always)]
        public int Skip { get; set; }

        [JsonProperty("take", Required = Required.Always)]
        public int Take { get; set; }

        [JsonProperty("rows", Required = Required.Always)]
        public T[] Row { get; set; }


    }
}
