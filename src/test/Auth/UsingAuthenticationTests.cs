using DutchGrit.Afas.Auth;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace DutchGrit.Afas.Tests.Auth
{
    public class UsingAuthenticationTests
    {
        private const string SessionInfoJson = "{\"info\":{\"envid\":\"O12345AA\",\"appName\":\"Test\",\"group\":\"Test\"}}";

        private class RecordingAuthentication : IAfasAuthentication
        {
            public string LastBaseUrl { get; private set; }

            public Task<string> GetAuthorizationHeaderAsync(HttpClient httpClient, string baseUrl)
            {
                this.LastBaseUrl = baseUrl;
                return Task.FromResult("Bearer token-1");
            }
        }

        private static StubHttpMessageHandler SessionInfoStub()
        {
            return new StubHttpMessageHandler(_ => new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(SessionInfoJson)
            });
        }

        [Fact]
        public async Task HeaderComesFromSuppliedAuthentication()
        {
            var handler = SessionInfoStub();
            var auth = new RecordingAuthentication();
            var client = AfasClient.UsingAuthentication(12345, auth, Environments.Test, new HttpClient(handler));

            await client.GetSessionInfoAsync();

            Assert.Equal("Bearer token-1", handler.LastRequest.Headers.GetValues("Authorization").Single());
            Assert.Equal("https://12345.resttest.afas.online/profitrestservices/", auth.LastBaseUrl);
        }

        [Fact]
        public async Task DefaultEnvironmentIsProduction()
        {
            var handler = SessionInfoStub();
            var client = AfasClient.UsingAuthentication(12345, new RecordingAuthentication(), customHttpClient: new HttpClient(handler));

            await client.GetSessionInfoAsync();

            Assert.Equal("https://12345.rest.afas.online/profitrestservices/metainfo", handler.LastRequest.RequestUri.ToString());
        }

        [Fact]
        public void NullAuthenticationThrowsException()
        {
            Assert.Throws<ArgumentNullException>(() => AfasClient.UsingAuthentication(12345, null));
        }
    }
}
