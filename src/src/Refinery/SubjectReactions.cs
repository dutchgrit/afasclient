using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas.Refinery
{

    /// <summary>
    /// fields: ["Mode", "SubjectId", "SubjectReactionMode"],
    /// values: [9, e, 1]
    /// </summary>
    [ConnectorName("PocketGetSubjectReactions")]
    public class SubjectReactions : IDataEntity
    {

        /// <summary>
        /// GUID
        /// </summary>
        [JsonProperty("guid")]
        public virtual int? guid { get; set; }


        /// <summary>
        /// Dossieritem
        /// </summary>
        [JsonProperty("subject")]
        public virtual int? subject { get; set; }


        /// <summary>
        /// Instuurdatum
        /// </summary>
        [JsonProperty("submitdate")]
        public virtual DateTime? submitdate { get; set; }


        /// <summary>
        /// Gebruiker
        /// </summary>
        [JsonProperty("person")]
        public virtual string person { get; set; }


        /// <summary>
        /// Onderwerp
        /// </summary>
        [JsonProperty("description")]
        public virtual string description { get; set; }


        /// <summary>
        /// Instuurder
        /// </summary>
        [JsonProperty("user")]
        public virtual string user { get; set; }


        /// <summary>
        /// Persoon
        /// </summary>
        [JsonProperty("person_id")]
        public virtual int? person_id { get; set; }


        /// <summary>
        /// Afbeelding
        /// </summary>
        [JsonProperty("image_id")]
        public virtual int? image_id { get; set; }


        /// <summary>
        /// Id reactie
        /// </summary>
        [JsonProperty("reaction_id")]
        public virtual int? reaction_id { get; set; }


        /// <summary>
        /// Medewerker
        /// </summary>
        [JsonProperty("employee_id")]
        public virtual string employee_id { get; set; }

    }
}
