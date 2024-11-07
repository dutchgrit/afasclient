using Newtonsoft.Json;

namespace DutchGrit.Afas
{
    public class GetConMetaInfoField
    {

        [JsonProperty("id", Required = Required.Always)]
        public string Id { get; set; }

        [JsonProperty("fieldId", Required = Required.Always)]
        public string FieldId { get; set; }

        [JsonProperty("dataType", Required = Required.Always)]
        public string DataType { get; set; }

        [JsonProperty("label")]
        public string Label { get; set; }

        [JsonProperty("length")]
        public int Length { get; set; }

        [JsonProperty("controlType", Required = Required.Always)]
        public int ControlType { get; set; }

        [JsonProperty("decimals", Required = Required.AllowNull)]
        public int Decimals { get; set; }

        [JsonProperty("decimalsFieldId")]
        public string DecimalsFieldId { get; set; }


    }
}
