using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas.Refinery
{


    /// </summary>
    [ConnectorName("PocketSubjectAttachments")]
    public class SubjectAttachments : IDataEntity
    {

        /// <summary>
        /// Dossieritem
        /// </summary>
        [JsonProperty("subject_id")]
        public virtual int? subject_id { get; set; }

        /// <summary>
        /// Bijlage-Id
        /// </summary>
        [JsonProperty("attachment_id")]
        public virtual int? attachment_id { get; set; }


        /// <summary>
        /// Bijlage
        /// </summary>
        [JsonProperty("file_id")]
        public virtual string file_id { get; set; }


        /// <summary>
        /// Naam
        /// </summary>
        [JsonProperty("file_name")]
        public virtual string file_name { get; set; }


        /// <summary>
        /// Bestandsgrootte
        /// </summary>
        [JsonProperty("file_size")]
        public virtual int? file_size { get; set; }
    }
}


//instelling

//zonder reactie:
//fields: ["Mode", "SubjectId", "ReactionId", "Skip", "Take"],
//values: [6, r, 0, -1, -1]

//SAmple response 

//"subject_id": 5433,
//"attachment_id": 4613,
//"file_id": "1AE2B050411ECE1FF5B50BBF6CA071E1",
//"file_name": "FunnyFace.png",
//"file_size": 522