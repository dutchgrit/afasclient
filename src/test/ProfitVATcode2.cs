using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas.Tests
{

    /// <summary>
    /// This class is used to test custom property names
    /// The Description property is renamed to Omschrijving
    /// </summary>


    [ConnectorName("Profit_VAT_code")]
    public class ProfitVATcode2 : IGetEntity
    {

        /// <summary>
        /// Btw-code
        /// </summary>

        [JsonProperty("VatCode")]
        public virtual string VatCode { get; set; }


        /// <summary>
        /// Omschrijving
        /// </summary>

        [JsonProperty("Description")]
        public virtual string Description { get; set; }


        /// <summary>
        /// Rekening
        /// </summary>

        [JsonProperty("AccountNr")]
        public virtual string AccountNr { get; set; }


        /// <summary>
        /// Tarief
        /// </summary>

        [JsonProperty("VatPerc")]
        public virtual double? VatPerc { get; set; }


        /// <summary>
        /// Btw-plicht
        /// </summary>

        [JsonProperty("VatDuty")]
        public virtual string VatDuty { get; set; }


        /// <summary>
        /// Geblokkeerd
        /// </summary>

        [JsonProperty("Blocked")]
        public virtual bool? Blocked { get; set; }


        /// <summary>
        /// Berekeningsmethode
        /// </summary>

        [JsonProperty("VatMethod")]
        public virtual string VatMethod { get; set; }


        /// <summary>
        /// Code inkoop/verkoop code
        /// </summary>

        [JsonProperty("VatType")]
        public virtual string VatType { get; set; }

    }
}
