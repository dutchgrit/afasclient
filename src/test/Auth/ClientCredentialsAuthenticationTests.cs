using DutchGrit.Afas.Auth;
using System;
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

        private static HttpResponseMessage Response(HttpStatusCode status, string body)
        {
            return new HttpResponseMessage(status)
            {
                Content = new StringContent(body)
            };
        }

        private static StubHttpMessageHandler CountingTokenStub()
        {
            var counter = 0;
            return new StubHttpMessageHandler(_ =>
            {
                counter++;
                return TokenResponse($"token-{counter}", 0);
            });
        }

        [Theory]
        [InlineData(60)]
        [InlineData(30)]
        public async Task CachesShortLivedToken(int expiresIn)
        {
            var handler = new StubHttpMessageHandler(_ => TokenResponse("token-1", expiresIn));
            var httpClient = new HttpClient(handler);
            var auth = new ClientCredentialsAuthentication("client", "secret");

            await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);
            await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);

            Assert.Equal(1, handler.CallCount);
        }

        [Theory]
        [InlineData(3600, 3540)]
        [InlineData(120, 90)]
        public async Task TokenIsValidUntilMarginBeforeExpiry(int expiresIn, int validSeconds)
        {
            var counter = 0;
            var handler = new StubHttpMessageHandler(_ =>
            {
                counter++;
                return TokenResponse($"token-{counter}", expiresIn);
            });
            var httpClient = new HttpClient(handler);
            var start = new DateTimeOffset(2026, 1, 1, 12, 0, 0, TimeSpan.Zero);
            var now = start;
            var auth = new ClientCredentialsAuthentication("client", "secret") { UtcNow = () => now };

            await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);
            now = start.AddSeconds(validSeconds - 1);
            var beforeMargin = await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);
            now = start.AddSeconds(validSeconds);
            var atMargin = await auth.GetAuthorizationHeaderAsync(httpClient, BaseUrl);

            Assert.Equal("Bearer token-1", beforeMargin);
            Assert.Equal("Bearer token-2", atMargin);
            Assert.Equal(2, handler.CallCount);
        }

        [Theory]
        [InlineData("{\"access_token\":\"token-1\",\"refresh_token\":null,\"token_type\":\"Bearer\",\"expires_in\":3600}")]
        [InlineData("{\"access_token\":\"token-1\",\"token_type\":\"Bearer\",\"expires_in\":3600}")]
        public async Task AcceptsNullOrMissingRefreshToken(string json)
        {
            var handler = new StubHttpMessageHandler(_ => Response(HttpStatusCode.OK, json));
            var auth = new ClientCredentialsAuthentication("client", "secret");

            var header = await auth.GetAuthorizationHeaderAsync(new HttpClient(handler), BaseUrl);

            Assert.Equal("Bearer token-1", header);
        }

        [Theory]
        [InlineData(HttpStatusCode.BadRequest)]
        [InlineData(HttpStatusCode.Unauthorized)]
        public async Task ErrorMessageContainsStatusAndErrorCodeOnly(HttpStatusCode status)
        {
            var body = "{\"error\":\"invalid_client\",\"error_description\":\"secret-text-xyz\"}";
            var handler = new StubHttpMessageHandler(_ => Response(status, body));
            var auth = new ClientCredentialsAuthentication("client", "secret");

            var exception = await Assert.ThrowsAsync<HttpRequestException>(() => auth.GetAuthorizationHeaderAsync(new HttpClient(handler), BaseUrl));

            Assert.Equal($"Failed to retrieve OAuth access token (HTTP {(int)status}, error: invalid_client).", exception.Message);
            Assert.DoesNotContain("secret-text-xyz", exception.ToString());
            Assert.Null(exception.InnerException);
        }

        [Theory]
        [InlineData("not json secret-text-xyz")]
        [InlineData("{\"error\":\"has spaces secret-text-xyz\"}")]
        [InlineData("{\"error\":\"secret-text-xyz-0123456789-0123456789-0123456789-0123456789-0123456789\"}")]
        [InlineData("{\"error\":\"invalid_client\\nsecret-text-xyz\"}")]
        [InlineData("{\"error\":42}")]
        [InlineData("[\"secret-text-xyz\"]")]
        public async Task UnexpectedErrorBodyGivesUnknownErrorCode(string body)
        {
            var handler = new StubHttpMessageHandler(_ => Response(HttpStatusCode.BadRequest, body));
            var auth = new ClientCredentialsAuthentication("client", "secret");

            var exception = await Assert.ThrowsAsync<HttpRequestException>(() => auth.GetAuthorizationHeaderAsync(new HttpClient(handler), BaseUrl));

            Assert.Equal("Failed to retrieve OAuth access token (HTTP 400, error: unknown).", exception.Message);
            Assert.DoesNotContain("secret-text-xyz", exception.ToString());
        }

        [Theory]
        [InlineData("not json secret-text-xyz")]
        [InlineData("{\"access_token\":\"\",\"error_description\":\"secret-text-xyz\"}")]
        public async Task UnreadableSuccessResponseGivesFixedMessage(string body)
        {
            var handler = new StubHttpMessageHandler(_ => Response(HttpStatusCode.OK, body));
            var auth = new ClientCredentialsAuthentication("client", "secret");

            var exception = await Assert.ThrowsAsync<HttpRequestException>(() => auth.GetAuthorizationHeaderAsync(new HttpClient(handler), BaseUrl));

            Assert.Equal("The token endpoint did not return a valid access token.", exception.Message);
            Assert.DoesNotContain("secret-text-xyz", exception.ToString());
        }

        [Fact]
        public async Task TokenWithoutLifetimeIsNotCached()
        {
            var handler = CountingTokenStub();
            var auth = new ClientCredentialsAuthentication("client", "secret");

            await auth.GetAuthorizationHeaderAsync(new HttpClient(handler), BaseUrl);
            await auth.GetAuthorizationHeaderAsync(new HttpClient(handler), BaseUrl);

            Assert.Equal(2, handler.CallCount);
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
