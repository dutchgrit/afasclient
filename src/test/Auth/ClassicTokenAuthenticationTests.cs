using DutchGrit.Afas.Auth;
using System;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DutchGrit.Afas.Tests.Auth
{
    public class ClassicTokenAuthenticationTests
    {
        [Fact]
        public async Task GeeftAfasTokenPrefixMetBase64()
        {
            var token = "<token><version>1</version><data>ABC</data></token>";
            var verwacht = "AfasToken " + Convert.ToBase64String(Encoding.ASCII.GetBytes(token));

            var auth = new ClassicTokenAuthentication(token);
            var header = await auth.GetAuthorizationHeaderAsync(null, null);

            Assert.Equal(verwacht, header);
        }

        [Fact]
        public void LeegTokenGooitException()
        {
            Assert.Throws<ArgumentException>(() => new ClassicTokenAuthentication(""));
        }
    }
}
