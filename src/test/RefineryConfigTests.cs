using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DutchGrit.Afas.Tests.Connectors
{
    public class RefineryConfigTests : IClassFixture<RefineryFixture>
    {
        RefineryFixture fixture;
        public RefineryConfigTests(RefineryFixture fixture) { this.fixture = fixture; }

        [Fact]
        public async Task CheckConfig()
        {
            //JsonConvert.
            var x = await fixture.Client.GetConfig();

           
            Assert.True(x.googlemapikey != "");
            //Version should exists of x.y.z 
            //ssert.True(x.Split('.').Length == 3);

            return;
        }



    }
}
