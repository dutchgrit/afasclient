using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas.Refinery
{
    [ConnectorName("GetWorkflowData")]
    public class WorkflowDataContext : IDataEntity
    {
        public bool InWorkflow { get; set; }
        public bool InWorkflowForCurrentUser { get; set; }
        public bool InfotaskForCurrentUser { get; set; }
        public long? ActivityId { get; set; }
        public DateTime ActivityDateTimeEntered { get; set; }
        public string WorkflowTaskDescription {get;set;}
        public string WorkflowTaskExtraText { get; set; }
        public long WorkflowTaskId { get; set; }
        public string UserIdDelegatedBy { get; set; }
        public string UserIdDelegatedTo { get; set; }
        public string UserNameDelegatedBy { get; set; }
        public string UserNameDelegatedTo { get; set; }
        public string AsyncStatus { get; set; }
    }
}


//WorkflowDatatype,SubjectId
//WorkflowContext,5433

//{
//    "InWorkflow": true,
//    "InWorkflowForCurrentUser": true,
//    "InfotaskForCurrentUser": false,
//    "ActivityId": 1910,
//    "ActivityDateTimeEntered": "2020-07-03T08:44:39Z",
//    "WorkflowTaskDescription": "Bevestigen",
//    "WorkflowTaskExtraText": "",
//    "WorkflowTaskId": 1000265,
//    "UserIdDelegatedBy": "",
//    "UserIdDelegatedTo": "",
//    "UserNameDelegatedBy": "",
//    "UserNameDelegatedTo": "",
//    "AsyncStatus": ""
//  }