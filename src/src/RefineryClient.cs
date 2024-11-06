using DutchGrit.Afas.Refinery;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{
    public class RefineryClient : RefineryBase, IRefineryClient
    {

        public RefineryClient(string LoginKey, string Token, string AppUID)
        {
            var basebytes = Encoding.ASCII.GetBytes($"{LoginKey}:{Token}");
            this.AuthAfasKeyToken = "AfasKeyToken " + Convert.ToBase64String(basebytes);
            this.AppUID = AppUID;
        }


        public DataQuery<T> DataQuery<T>() where T : IDataEntity
        {
            return new DataQuery<T>(this);
        }

        public AfasQuery<T> Query<T>() where T : IGetEntity
        {
            return new AfasQuery<T>(this);
        }

        public async Task<Config> GetConfig()
        {
            var q = await GetApiAsync<Config>("config");
            return q;
        }



        public async Task<SubjectAttachments[]> GetSubjectAttachments(long SubjectID)
        {
            //fields: ["Mode", "SubjectId", "ReactionId", "Skip", "Take"],
            //values: [6, r, 0, -1, -1]
            var qs = await this.DataQuery<SubjectAttachments>()
                        .Where("Mode", 6)
                        .Where("SubjectId", SubjectID.ToString())
                        .Where("ReactionId",0)
                        .Skip(-1)
                        .Take(-1)
                        .GetAsync();
            return qs;
        }

        public async Task<SubjectAttachments[]> GetSubjectReactionAttachments(long SubjectID, int ReactionID)
        {
            //fields: ["Mode", "SubjectId", "ReactionId", "Skip", "Take"],
            //values: [7, r, i, -1, -1]
            var qs = await this.DataQuery<SubjectAttachments>()
                        .Where("Mode", 7)
                        .Where("SubjectId", SubjectID.ToString())
                        .Where("ReactionId", ReactionID)
                        .Skip(-1)
                        .Take(-1)
                        .GetAsync();
            return qs;
        }

        public async Task<SubjectReactions[]> GetSubjectReactions(long SubjectID)
        {
            //fields: ["Mode", "SubjectId", "SubjectReactionMode"],
            /// values: [9, e, 1]
            var qs = await this.DataQuery<SubjectReactions>()
                        .Where("Mode", "9")
                        .Where("SubjectId", SubjectID.ToString())
                        .Where("SubjectReactionMode", "1")
                        .GetAsync();
            return qs;
        }


        public async Task<WorkflowDataContext> GetWorkflowDataContext(long SubjectID)
        {
            //WorkflowDatatype,SubjectId
            //WorkflowContext,5433
            var qs = await this.DataQuery<WorkflowDataContext>()
                        .Where("WorkflowDatatype", "WorkflowContext")
                        .Where("SubjectId", SubjectID.ToString())
                        .GetAsync();
            return qs.FirstOrDefault();
        }


        public async Task<WorkflowDataActions[]> GetWorkflowDataActions(long ActivityId)
        {
            //WorkflowDatatype % 2CActivityId & values = WorkflowActions % 2C1910
            var qs = await this.DataQuery<WorkflowDataActions>()
                        .Where("WorkflowDatatype", "WorkflowActions")
                        .Where("ActivityId", ActivityId.ToString())
                        .GetAsync();

            return qs;
        }


    }
}
