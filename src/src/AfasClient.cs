using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{

    public class AfasClient : AfasBase, IAfasClient
    {

        public AfasClient(int MemberNumber, string Token, Environments Env = Environments.Production, HttpClient customHttpClient=null)
        {
            this.MemberNumber = MemberNumber;
            this.Environment = Env;
            //Convert the Token string into Base64.
            var authToken = Encoding.ASCII.GetBytes(Token);
            this.Token64 = "AfasToken " + Convert.ToBase64String(authToken);


            if (customHttpClient != null)
            {
                this.httpClient = customHttpClient;
            }
        }

        public Task<SessionInfo> GetSessionInfoAsync()
        {
            return GetApiAsync<SessionInfo>("metainfo");
        }

        public Task<UpdateConMetaInfo> GetMetaDataUpdConAsync(string connector)
        {
            return GetApiAsync<UpdateConMetaInfo>($"metainfo/update/{connector}");
        }

        public Task<GetConMetaInfo> GetMetaDataGetConAsync(string connector)
        {
            return GetApiAsync<GetConMetaInfo>($"metainfo/get/{connector}");
        }

        public async Task<string> GetVersionAsync()
        {
            //Only works when AppConnectorVersion is included! 
            var z = await this.GetApiAsync<AfasVersion>("profitversion");
            return z.Version;
        }

       
        public async Task<FileInfo> GetFileBySubjectAsync(int SubjectID, string FileID)
        {
            using (var res = await this.GetAuthHttp($"subjectconnector/{SubjectID}/{FileID}"))
            {
                int code = (int)res.StatusCode;
                if (code >= 200 && code <= 299)
                {
                    var txt = await res.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<FileInfo>(txt);
                }
                if (res.StatusCode == HttpStatusCode.NotFound)
                {
                    return null;
                }
                //bij een andere reden, gewoon laten klappen!
                res.EnsureSuccessStatusCode();
                return null;
            }
        }

        public AfasQuery<T> Query<T>() where T : IGetEntity
        {
            return new AfasQuery<T>(this);
        }
   

        public string GetVersion() => AsyncHelpers.RunSync<string>(() => GetVersionAsync());

        public SessionInfo GetSessionInfo() => AsyncHelpers.RunSync<SessionInfo>(() => GetSessionInfoAsync());

        public FileInfo GetFileBySubject(int SubjectID, string FileID) => AsyncHelpers.RunSync<FileInfo>( () => GetFileBySubjectAsync(SubjectID, FileID ));

    }
}
