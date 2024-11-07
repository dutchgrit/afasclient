﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DutchGrit.Afas.CodeGen
{
    public class UpdateConEmit
    {

        public static string EmitUpdateConnector(UpdateConMetaInfo meta, EmitOptions options = null)
        {
            if (options == null) { options = new EmitOptions(); }

            var sb = new StringBuilder();

            sb.AppendLine($"using Newtonsoft.Json;");
            sb.AppendLine($"using System;");
            sb.AppendLine($"using System.Collections.Generic;");
            sb.AppendLine($"using System.ComponentModel.DataAnnotations;");
            sb.AppendLine($"using System.Text;");
            sb.AppendLine($"using DutchGrit.Afas;");
            sb.AppendLine($"");
            sb.AppendLine($"// Autogenerated using afas-cli.");
            sb.AppendLine($"");
            sb.AppendLine($"namespace {options.NameSpace}");
            sb.AppendLine($"{{");


            if (!string.IsNullOrEmpty(meta.Description))
            {
                sb.AppendLine($"    /// <summary>");
                sb.AppendLine($"    /// {meta.Description}");
                sb.AppendLine($"    /// </summary>");
            }

            //Make sure to record the ConnectorName 
            if (meta.IsConnected)
            {
                sb.AppendLine($"    [ConnectorName(\"{meta.Id}\")] ");
            }

            //Check if there are PrimaryKey fields
            foreach (var primField in meta.Fields.Where(x => x.PrimaryKey.ToLower() == "true"))
            {
                sb.AppendLine($"    [KeyField(\"{primField.FieldId}\")] ");
            }



            sb.AppendLine($"    {options.GetClassAccessModifier} class {meta.Name} : {Helpers.GetInterfaceString(meta.IsConnected)}");
            sb.AppendLine("    {");

            //loop throught fields
            foreach (var item in meta.Fields)
            {
                sb.AppendLine($"        /// <summary>");
                sb.AppendLine($"        /// {item.Label}");
                sb.AppendLine($"        /// </summary>");
                //if (item.Mandatory)
                //{
                //    sb.sb.AppendLine($"        [JsonRequired()]");
                //}
                sb.AppendLine($"        [JsonProperty(\"{item.FieldId}\")]");

                if (item.DataType == "string")
                {
                    sb.AppendLine($"        [MaxLength({item.Length}, ErrorMessage = \"{{0}} has a max of {{1}} characters\")]");
                }

                sb.AppendLine($"        public virtual {Helpers.DataTypeToType(item.DataType, item.ControlType)} {item.FieldId} {{ get; set; }}");
                sb.AppendLine("");

                if (item.Values != null)
                {
                    sb.AppendLine($"        public static Dictionary<string, string> {item.FieldId}Values = new Dictionary<string, string>()");
                    sb.AppendLine($"        {{");
                    foreach (var valueItem in item.Values)
                    {
                        sb.AppendLine($"            {{\"{valueItem.Id}\",\"{valueItem.Description}\" }},");
                    }
                    sb.AppendLine($"        }};");
                    sb.AppendLine("");
                }
            };


            if (meta.Objects != null)
            {
                sb.AppendLine($"        [JsonIgnore()]");
                sb.AppendLine($"        public {nameof(IUpdateEntity)}[] Objects");
                sb.AppendLine($"        {{");
                sb.AppendLine($"            get");
                sb.AppendLine($"            {{");
                sb.AppendLine($"                return _Objects.Count == 0 ? null : _Objects.ToArray();");
                sb.AppendLine($"            }}");
                sb.AppendLine($"        }}");
                sb.AppendLine("");
                sb.AppendLine($"        [JsonIgnore()]");
                sb.AppendLine($"        private List<{nameof(IUpdateEntity)}> _Objects = new List<{nameof(IUpdateEntity)}>();");
                sb.AppendLine("");

                //Add helper methods to easily add new IEntity objects to the Objects array          
                foreach (var nextObj in meta.Objects)
                {
                    sb.AppendLine($"        public void Add{nextObj.Name}({nextObj.Name} {nextObj.Name.ToLower()})");
                    sb.AppendLine($"        {{");
                    sb.AppendLine($"            this._Objects.Add({nextObj.Name.ToLower()});");
                    sb.AppendLine($"        }}");
                    sb.AppendLine("");
                }
            }
            else
            {
                sb.AppendLine($"        [JsonIgnore()]");
                sb.AppendLine($"        public {nameof(IUpdateEntity)}[] Objects => null;");
            }

            sb.AppendLine("    }");

            //Enums of integer based 
            foreach (var fieldinfo in meta.Fields.Where(f => f.Values != null))
            {
                //Determine if values are all integer based.
                var isInteger = true;
                foreach (var valueinfo in fieldinfo.Values)
                {
                    isInteger &= int.TryParse(valueinfo.Id, out _);
                }

                if (isInteger)
                {
                    sb.AppendLine($"    public enum {meta.Name}{fieldinfo.FieldId}Values");
                    sb.AppendLine($"    {{");
                    var usedNames = new List<string>();
                    foreach (var valueinfo in fieldinfo.Values)
                    {
                        var valueName = valueinfo.Description.RemoveDiacritics().AsCodeName();

                        //valueName mag niet al een keer gebruikt zijn, zowel, aanvullen met een underscore.

                        while (usedNames.Contains(valueName)) { valueName += "_"; }
                        usedNames.Add(valueName);
                        sb.AppendLine($"        {valueName} = {valueinfo.Id},");
                    }
                    sb.AppendLine($"    }}");
                    sb.AppendLine("");
                }
            }
            sb.AppendLine($"}}");
            return sb.ToString();
        }

    }
}
