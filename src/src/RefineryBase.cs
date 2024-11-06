using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{
    public abstract class RefineryBase : GeneralBase
    {


        public const string appversion = "23288";

        protected HttpClient httpClient = GeneralBase.httpClientInternal;

        protected string AppUID { get; set; } = "U81UFQS";

        //loginkey   = MZDTYT
        protected string LoginKey { get; set; }

        protected string Token { get; set; }

        protected string AuthAfasKey { get; set; }
       
        protected string AuthAfasKeyToken { get; set; }

        protected override string GetBaseUrl
        {
            get
            {
                return "https://refinery.afaspocket.nl/";
            }
        }


        protected override async Task<HttpResponseMessage> GetAuthHttp(string urlPath)
        {
            using (var httpRequestMessage = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(this.GetBaseUrl + urlPath),
                Headers = {
                    { "Authorization", this.AuthAfasKeyToken },
                    { "appuid", AppUID },
                    { "appversion", appversion },
                    //{ "userid" ,  }
                }
            })
            {
                return await httpClient.SendAsync(httpRequestMessage);
            }
        }

        protected override async Task<HttpResponseMessage> SendAuthHttp(string urlPath, string content, HttpMethod method)
        {
            using (var httpRequestMessage = new HttpRequestMessage
            {
                Method = method,
                RequestUri = new Uri(this.GetBaseUrl + urlPath),
                Headers = {
                    { "Authorization", this.AuthAfasKeyToken },
                    { "appuid", AppUID },
                    { "appversion", appversion },
                    //{ "userid" ,  }
                },
                Content = new StringContent(content)
            })
            {
                return await httpClient.SendAsync(httpRequestMessage);
            }
        }





        protected override async Task<HttpResponseMessage> OtpPost(string urlPath, string content)
        {
            using (var httpRequestMessage = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(this.GetBaseUrl + urlPath),
                Headers = {
                    { "Authorization", this.AuthAfasKey },
                    { "appversion" , appversion }
                },
                Content = new StringContent(content)
            })
            {
                return await httpClient.SendAsync(httpRequestMessage);
            }
        }



    }
}
