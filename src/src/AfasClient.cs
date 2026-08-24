using DutchGrit.Afas.Auth;
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
        /// <summary>
        /// Constructor for the AfasClient using a classic AFAS token.
        /// </summary>
        /// <param name="integrationId">The integrationId to add as a request header. https://docs.afas.help/Profit/nl/IntegrationId</param>
        /// <remarks>
        /// Note: If a customHttpClient is provided, the integrationId header will be overwritten by the integrationId parameter.
        /// The classic token will be discontinued on 01-09-2027; prefer using <see cref="UsingClientCredentials"/>.
        /// </remarks>
        public AfasClient(int MemberNumber, string Token, Environments Env = Environments.Production, HttpClient customHttpClient = null, string integrationId = null)
            : this(MemberNumber, new ClassicTokenAuthentication(Token), Env, customHttpClient, integrationId)
        {
        }

        /// <summary>
        /// Constructor for the AfasClient using a specific authentication strategy.
        /// </summary>
        private AfasClient(int MemberNumber, IAfasAuthentication authentication, Environments Env, HttpClient customHttpClient, string integrationId)
        {
            this.MemberNumber = MemberNumber;
            this.Environment = Env;
            this.Authentication = authentication;
            this.IntegrationId = integrationId;

            if (customHttpClient != null)
            {
                this.httpClient = customHttpClient;
            }
        }

        /// <summary>
        /// Creates an AfasClient using a classic AFAS token (explicit alternative to the default constructor).
        /// Note: the classic token will be discontinued on 01-09-2027.
        /// </summary>
        public static AfasClient UsingClassicToken(int memberNumber, string token, Environments env = Environments.Production, HttpClient customHttpClient = null, string integrationId = null)
        {
            return new AfasClient(memberNumber, new ClassicTokenAuthentication(token), env, customHttpClient, integrationId);
        }

        /// <summary>
        /// Creates an AfasClient using the OAuth Client Credentials flow. The access token is
        /// automatically retrieved from the token endpoint and refreshed before it expires.
        /// </summary>
        public static AfasClient UsingClientCredentials(int memberNumber, string clientId, string clientSecret, Environments env = Environments.Production, HttpClient customHttpClient = null, string integrationId = null)
        {
            return new AfasClient(memberNumber, new ClientCredentialsAuthentication(clientId, clientSecret), env, customHttpClient, integrationId);
        }

        /// <summary>
        /// Creates an AfasClient using a previously obtained OAuth bearer (access) token.
        /// The consumer is responsible for obtaining and refreshing the token themselves.
        /// </summary>
        public static AfasClient UsingBearerToken(int memberNumber, string accessToken, Environments env = Environments.Production, HttpClient customHttpClient = null, string integrationId = null)
        {
            return new AfasClient(memberNumber, new BearerTokenAuthentication(accessToken), env, customHttpClient, integrationId);
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
