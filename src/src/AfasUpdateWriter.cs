using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace DutchGrit.Afas
{

    static class AfasUpdateWriter
    {


        public static string Write(IUpdateEntity value, IUpdateEntity[] elements)
        {
            StringBuilder sb = new StringBuilder();
            StringWriter sw = new StringWriter(sb);

            using (JsonWriter writer = new JsonTextWriter(sw))
            {
                writer.Formatting = Formatting.Indented;

                writer.WriteStartObject();


                writer.WritePropertyName(value.GetType().Name);
                writer.WriteStartObject();

                writer.WritePropertyName("Element");
                if (elements.Length>1)
                {
                    writer.WriteStartArray();
                }

                foreach (var element in elements)
                {
                    writer.WriteStartObject();

                    //Get KeyFieldName
                    var keyFields = KeyFieldAttribute.GetFieldNames(element);
                    if (keyFields != null)
                    {
                        foreach (var keyField in keyFields)
                        {
                            var keyValue = element.GetType().GetProperty(keyField).GetValue(element, null);
                            if (keyValue != null)
                            {
                                writer.WritePropertyName("@" + keyField);
                                writer.WriteValue(keyValue);
                            }
                        }   
                    }

                    writer.WritePropertyName("Fields");
                    writer.WriteRawValue(JsonConvert.SerializeObject(element, new JsonSerializerSettings() { NullValueHandling = NullValueHandling.Ignore }));


                    if (element.Objects != null)
                    {
                        writer.WritePropertyName("Objects");
                        writer.WriteStartArray();
                        //loop geordend door de Objecten heen. 
                        //welke 'unieke' objecten zitten erin?
                        var uniqueObjects = element.Objects.Select(x => x.GetType().Name).Distinct().ToArray();
                        foreach (var uniqueObject in uniqueObjects)
                        {
                            //bepaal hoeveel objecten van dit type er zijn. 
                            var subelements = element.Objects.Where(x => x.GetType().Name == uniqueObject).ToArray();
                            writer.WriteRawValue(Write(subelements[0], subelements));
                        }
                        writer.WriteEndArray();
                    }


                    writer.WriteEndObject();

                }

                if (elements.Length > 1)
                {
                    writer.WriteEndArray();
                }

                writer.WriteEndObject();
                writer.WriteEndObject();
            }

            return sb.ToString();
        }
    }


}

