using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas
{
    public class FileInfo
    {

        [JsonProperty("filename", Required = Required.Always)]
        public string FileName { get; set; }

        [JsonProperty("filedata", Required = Required.Always)]
        public string FileDataBase64 { get; set; }

        [JsonProperty("mimetype", Required = Required.Always)]
        public string mimetype { get; set; }


    }
}
