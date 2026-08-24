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
        public async Task RetrievesTokenAndReturnsBearerHeader()
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
        public async Task CachesValidToken()
        {
            var handler = new StubHttpMessageHandler(_ => TokenResponse("token-1", 3600));
            var httpClient = new HttpClient(handler);
            var auth = new ClientCredentialsAuthentication("client", "secret");

            await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);
            await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);

            // Second call should come from cache: only one token call.
            Assert.Equal(1, handler.CallCount);
        }

        [Fact]
        public async Task RefreshesExpiredToken()
        {
            var counter = 0;
            // expires_in 0 falls within the expiry margin, so the token is considered expired immediately.
            var handler = new StubHttpMessageHandler(_ =>
            {
                counter++;
                return TokenResponse($"token-{counter}", 0);
            });
            var httpClient = new HttpClient(handler);
            var auth = new ClientCredentialsAuthentication("client", "secret");

            var first = await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);
            var second = await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);

            Assert.Equal("Bearer token-1", first);
            Assert.Equal("Bearer token-2", second);
            Assert.Equal(2, handler.CallCount);
        }

        [Fact]
        public async Task ThrowsOnErrorResponse()
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
