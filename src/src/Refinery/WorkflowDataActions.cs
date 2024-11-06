using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas.Refinery
{

    [ConnectorName("GetWorkflowData")]
    public class WorkflowDataActions : IDataEntity
    {
        public long ActionId { get; set; }
        public string Caption { get; set; }
        public string ExtraCaption { get; set; }
        public int ActionTypeId { get; set; }

        public int PresentationSeqno { get; set; }

        public string ReactionMandatoryType { get; set; }

        public string WebImageFileId { get; set; }
        public string WebImageFilename { get; set; }

        public int ActionCategoryId { get; set; }

        public bool UserRequiredOnHandle { get; set; }

        public string ActionName { get; set; }
    }
}

    //{
    //  "ActionId": 1,
    //  "Caption": "Akkoord",
    //  "ExtraCaption": "",
    //  "ActionTypeId": 1,
    //  "PresentationSeqno": 1,
    //  "ReactionMandatoryType": "NotMandatory",
    //  "WebImageFileId": "5F16D947494AF35BDD6E9199DA5CCFA0",
    //  "WebImageFilename": "afhandelen.png",
    //  "ActionCategoryId": "1",
    //  "UserRequiredOnHandle": false,
    //  "ActionName": "25E6D7A9E19B4157B9B39AA6CB100DC9"
    //}