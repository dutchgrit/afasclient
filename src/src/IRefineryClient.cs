using DutchGrit.Afas.Refinery;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{
    public interface IRefineryClient : IGeneralClient
    {

        DataQuery<T> DataQuery<T>() where T : IDataEntity;

        Task<WorkflowDataContext> GetWorkflowDataContext(long SubjectID);

        Task<WorkflowDataActions[]> GetWorkflowDataActions(long ActivityId);


        Task<SubjectAttachments[]> GetSubjectAttachments(long SubjectID);

        Task<SubjectAttachments[]> GetSubjectReactionAttachments(long SubjectID, int ReactionID);

        Task<SubjectReactions[]> GetSubjectReactions(long SubjectID);



        Task<Config> GetConfig();


    }
}
