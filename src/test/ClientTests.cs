using DutchGrit.Afas;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using Xunit;

namespace DutchGrit.Afas.Tests
{

    public class ClientTests : IClassFixture<ClientFixture>
    {
        ClientFixture fixture;
        public ClientTests(ClientFixture fixture) { this.fixture = fixture; }

        [Fact]
        public void Version()
        {
            var x= fixture.Client.GetVersion();            
            Assert.True(x.Length > 0);
            //Version should exists of x.y.z 
            Assert.True(x.Split('.').Length == 3);
        }

        [Fact]
        public void SessionInfoSync()
        {

            var x = fixture.Client.GetSessionInfo();
            Assert.Contains(fixture.MemberId.ToString(), x.Info.EnvironmentID);
            Assert.True(x.GetConnectors.Length > 0, "No GetConnectors found.");
            Assert.Contains(x.GetConnectors, x => x.Id.ToLower() == "profit_vat_code");
        }

        

        [Fact]
        public async Task SessionInfoAsync()
        {
            var x = await fixture.Client.GetSessionInfoAsync();
            Assert.Contains(fixture.MemberId.ToString(), x.Info.EnvironmentID);
            Assert.True(x.GetConnectors.Length > 0, "No GetConnectors found.");
            Assert.Contains(x.GetConnectors, x => x.Id.ToLower() == "profit_vat_code");
        }
     

    }
}
