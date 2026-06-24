using DutchGrit.Afas.Auth;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace DutchGrit.Afas.Tests.Auth
{
    public class ClientCredentialsAuthenticationTests
    {
        private const string BaseUrl = "https://12345.resttest.afas.online/profitrestservices/";

        private static HttpResponseMessage TokenResponse(string accessToken, int expiresIn)
        {
            var json = $"{{\"access_token\":\"{accessToken}\",\"refresh_token\":null,\"token_type\":\"Bearer\",\"expires_in\":{expiresIn}}}";
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json)
            };
        }

        [Fact]
        public async Task HaaltTokenOpEnGeeftBearerHeader()
        {
            var handler = new StubHttpMessageHandler(_ => TokenResponse("token-1", 3600));
            var httpClient = new HttpClient(handler);
            var auth = new ClientCredentialsAuthentication("client", "secret");

            var header = await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);

            Assert.Equal("Bearer token-1", header);
            Assert.Equal(BaseUrl + "oauth/token", handler.LastRequest.RequestUri.ToString());
            Assert.Equal(HttpMethod.Post, handler.LastRequest.Method);
        }

        [Fact]
        public async Task CachetGeldigToken()
        {
            var handler = new StubHttpMessageHandler(_ => TokenResponse("token-1", 3600));
            var httpClient = new HttpClient(handler);
            var auth = new ClientCredentialsAuthentication("client", "secret");

            await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);
            await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);

            // Tweede aanroep moet uit cache komen: maar één token-call.
            Assert.Equal(1, handler.CallCount);
        }

        [Fact]
        public async Task VerverstVerlopenToken()
        {
            var teller = 0;
            // expires_in 0 valt binnen de vervalmarge, dus het token geldt direct als verlopen.
            var handler = new StubHttpMessageHandler(_ =>
            {
                teller++;
                return TokenResponse($"token-{teller}", 0);
            });
            var httpClient = new HttpClient(handler);
            var auth = new ClientCredentialsAuthentication("client", "secret");

            var eerste = await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);
            var tweede = await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);

            Assert.Equal("Bearer token-1", eerste);
            Assert.Equal("Bearer token-2", tweede);
            Assert.Equal(2, handler.CallCount);
        }

        [Fact]
        public async Task GooitBijFoutResponse()
        {
            var handler = new StubHttpMessageHandler(_ => new HttpResponseMessage(HttpStatusCode.Unauthorized)
            {
                Content = new StringContent("invalid_client")
            });
            var httpClient = new HttpClient(handler);
            var auth = new ClientCredentialsAuthentication("client", "secret");

            await Assert.ThrowsAsync<HttpRequestException>(() => auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl));
        }
    }
}
