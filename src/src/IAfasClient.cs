using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{


    public interface IAfasClient : IGeneralClient
    {
        /// <summary>
        /// Returns the Afas version as string.
        /// Requires that `AppConnectorVersion` is installed
        /// </summary>
        /// <returns>Example : 12.12.2</returns>
        Task<string> GetVersionAsync();

        string GetVersion();

        Task<SessionInfo> GetSessionInfoAsync();

        SessionInfo GetSessionInfo();

        Task<UpdateConMetaInfo> GetMetaDataUpdConAsync(string connector);

        Task<GetConMetaInfo> GetMetaDataGetConAsync(string connector);

      

   
        //object Query<T>();

        //Task<UpdateResult<TResult>> Delete<TResult>(int Number) where T : IUpdateable;

     

 


        Task<FileInfo> GetFileBySubjectAsync(int SubjectID, string FileID);

        FileInfo GetFileBySubject(int SubjectID, string FileID);

    }
}
