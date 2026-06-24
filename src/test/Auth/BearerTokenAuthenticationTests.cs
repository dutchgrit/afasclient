using DutchGrit.Afas.Auth;
using System;
using System.Threading.Tasks;
using Xunit;

namespace DutchGrit.Afas.Tests.Auth
{
    public class BearerTokenAuthenticationTests
    {
        [Fact]
        public async Task GeeftBearerPrefix()
        {
            var auth = new BearerTokenAuthentication("abc123");
            var header = await auth.GetAuthorizationHeaderAsync(null, null);

            Assert.Equal("Bearer abc123", header);
        }

        [Fact]
        public void LeegTokenGooitException()
        {
            Assert.Throws<ArgumentException>(() => new BearerTokenAuthentication(""));
        }
    }
}
