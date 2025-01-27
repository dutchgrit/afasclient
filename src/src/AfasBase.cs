using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{
    public class AfasBase : GeneralBase
    {

        protected HttpClient httpClient = GeneralBase.httpClientInternal;
        
        protected int MemberNumber { get; set; }

        protected Environments Environment { get; set; }

        protected string Token64 { get; set; }

        protected string IntegrationId { get; set; }

        protected override string GetBaseUrl
        {
            get
            {
                return $"https://{MemberNumber}.rest{Environment.AsUrlAddition()}.afas.online/profitrestservices/";
            }
        }

        protected override async Task<HttpResponseMessage> GetAuthHttp(string urlPath)
        {
            using (var httpRequestMessage = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(this.GetBaseUrl + urlPath),
                Headers = {
                    { "Authorization", this.Token64 }
                }
            })
            {
                AddIntegrationId(httpRequestMessage);
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
                    { "Authorization", this.Token64 }
                },
                Content = new StringContent(content)                
            })
            {
                AddIntegrationId(httpRequestMessage);
                return await httpClient.SendAsync(httpRequestMessage);
            }
        }

        protected override async Task<HttpResponseMessage> OtpPost(string urlPath, string content)
        {
            using (var httpRequestMessage = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(this.GetBaseUrl + urlPath),
                Content = new StringContent(content)
            })
            {
                return await httpClient.SendAsync(httpRequestMessage);
            }
        }

        private void AddIntegrationId(HttpRequestMessage httpRequestMessage)
        {
            if (httpClient.DefaultRequestHeaders.Contains("IntegrationId"))
                httpClient.DefaultRequestHeaders.Remove("IntegrationId");
            if (!string.IsNullOrWhiteSpace(this.IntegrationId))
            {
                httpRequestMessage.Headers.Add("IntegrationId", this.IntegrationId);
            }
        }

    }
}
