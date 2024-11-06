using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas.Refinery
{

    public class Config
    {
        public string fastestroute { get; set; }
        public string googlemapikey { get; set; }
        public string kmcostid { get; set; }
        public string leavetypeid { get; set; }
        public object loggingconfig { get; set; }
        public string mayapprovehours { get; set; }
        public bool maychooseleavetype { get; set; }
        public int[] modules { get; set; }
        public string profitversion { get; set; }
        public string showinternextern { get; set; }
        public string subjecttypeidgoodsreceived { get; set; }
        public string costtypeisworkbudget { get; set; }
        public string techversion { get; set; }
        public object timesheetconfig { get; set; }
        public string biologin { get; set; }
        public string pocketChatUser { get; set; }
        public string pocketChatToken { get; set; }
        public DateTime pocketChatTokenExpDate { get; set; }
        public bool mustupdate { get; set; }

    }
}



//{
//  "fastestroute": "0",
//  "googlemapikey": "AIzaSyCP_c59z36e2GhVHAdGg0hhZvL05GpE32k",
//  "kmcostid": "",
//  "leavetypeid": "V",
//  "loggingconfig": null,
//  "mayapprovehours": "1",
//  "maychooseleavetype": true,
//  "modules": [
//    1,
//    2,
//    3,
//    4,
//    5,
//    6,
//    7,
//    8,
//    9,
//    10,
//    11,
//    12,
//    13,
//    14,
//    15,
//    18,
//    19,
//    23
//  ],
//  "profitversion": "3.1.3",
//  "showinternextern": "0",
//  "subjecttypeidgoodsreceived": null,
//  "costtypeisworkbudget": null,
//  "techversion": "2.9.1000.3",
//  "timesheetconfig": null,
//  "biologin": "1",
//  "pocketChatUser": "",
//  "pocketChatToken": "",
//  "pocketChatTokenExpDate": "1899-12-30T00:00:00Z",
//  "mustupdate": false
//}