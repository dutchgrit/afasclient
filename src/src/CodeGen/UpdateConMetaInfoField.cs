using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace DutchGrit.Afas
{
    public class UpdateConMetaInfoField : IMergeable<UpdateConMetaInfoField>
    {
        [JsonProperty("fieldId")]
        public string FieldId {get;set;}

        [JsonProperty("primaryKey")]
        public string PrimaryKey { get; set; }

        [JsonProperty("dataType")]
        public string DataType { get; set; }

        [JsonProperty("label")]
        public string Label { get; set; }

        [JsonProperty("mandatory")]
        public bool Mandatory { get; set; }

        [JsonProperty("length")]
        public int Length { get; set; }

        [JsonProperty("controlType")]
        public int ControlType { get; set; }

        [JsonProperty("decimals")]
        public int Decimals { get; set; }

        [JsonProperty("notzero")]
        public bool NotZero { get; set; }

        [JsonProperty("values")]
        public MetaInfoValue[] Values { get; set; }

        public void MergeWith(UpdateConMetaInfoField other)
        {
            //Checks
            if (this.FieldId != other.FieldId) { throw new ArgumentOutOfRangeException("FieldId should match."); }
            if (this.DataType != other.DataType) { throw new ArgumentOutOfRangeException("DataType should match."); }
            
            //Properties
            this.PrimaryKey = other.PrimaryKey == "true" ? "true" : this.PrimaryKey;
            this.Label = MergeUtils.MergeString(this.Label, other.Label);
            this.Mandatory = this.Mandatory || other.Mandatory;
            this.NotZero = this.NotZero || other.NotZero;

            //Values -> not merged, but we pick the longest list.
            var valuesThis = new List<MetaInfoValue>();
            if (this.Values!=null) { valuesThis.AddRange(this.Values); }
            var valuesOther = new List<MetaInfoValue>();
            if (other.Values!=null ) { valuesOther.AddRange(other.Values); }
            this.Values = (valuesThis.Count >= valuesOther.Count) ? valuesThis.ToArray() : valuesOther.ToArray();
            if (this.Values.Length==0) { this.Values = null; }


        }
    }


}
