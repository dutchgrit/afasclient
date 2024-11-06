using DutchGrit.Afas.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DutchGrit.Afas.Tests
{
    public class RefineryTests : IClassFixture<RefineryFixture>
    {
        RefineryFixture fixture;
        public RefineryTests(RefineryFixture fixture) { this.fixture = fixture; }


        [Fact]
        public async Task TaskDetails()
        {

            var client = fixture.Client;

            var userTasksAfas = await client.Query<TafasTasksDetails>()
                          .Take(-1).Skip(-1)
                          .GetAsync();
        }
    }
}
