using DutchGrit.Afas.Auth;
using System;
using System.Threading.Tasks;
using Xunit;

namespace DutchGrit.Afas.Tests.Auth
{
    public class AfasClientSubclassTests
    {
        private class SubclassedClient : AfasClient
        {
            public SubclassedClient(IAfasAuthentication authentication)
                : base(12345, authentication, Environments.Test, null, null)
            {
            }

            public SubclassedClient(string token)
                : base(12345, token, Environments.Test)
            {
            }

            public IAfasAuthentication CurrentAuthentication => Authentication;
        }

        [Fact]
        public async Task SubclassCanSupplyAuthentication()
        {
            var client = new SubclassedClient(new BearerTokenAuthentication("my-access-token"));

            var header = await client.CurrentAuthentication.GetAuthorizationHeaderAsync(null, null);

            Assert.Equal("Bearer my-access-token", header);
        }

        [Fact]
        public void SubclassWithClassicTokenStillUsesClassicTokenAuthentication()
        {
            var client = new SubclassedClient("<token><version>1</version><data>ABC</data></token>");

            Assert.IsType<ClassicTokenAuthentication>(client.CurrentAuthentication);
        }

        [Fact]
        public void SubclassWithNullAuthenticationThrowsException()
        {
            Assert.Throws<ArgumentNullException>(() => new SubclassedClient((IAfasAuthentication)null));
        }
    }
}
