using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DutchGrit.Afas.Tests
{
    public class QueryTests : IClassFixture<ClientFixture>
    {

        ClientFixture fixture;
        public QueryTests(ClientFixture fixture) { 
            this.fixture = fixture;   
            //preload the data 
        }

        [Fact]
        public async Task ShouldHaveRecords()
        {
            var records = await this.fixture.Client.Query<ProfitVATcode>().GetAsync();
            Assert.True(records.Length>0, "No records where found in ProfitVATCode.");

        }

        [Fact]
        public async Task CheckWhereClause()
        {
            var records1 = await this.fixture.Client.Query<ProfitVATcode>()
                .WhereEquals("VatPerc","21")
                .GetAsync();

            Assert.True(records1.Length > 0);
            //TODO how to compare recordS?
        }

        [Fact]
        public async Task ChunkedIsSame()
        {
            var records1 = await this.fixture.Client.Query<ProfitVATcode>().GetAsync();
            var records2 = await this.fixture.Client.Query<ProfitVATcode>().GetChunkedAsync();

            Assert.True(records1.Length == records2.Length, "Chunked failed.");

            //TODO how to compare recordS?
       }



        [Fact]
        public async Task SyncAsyncIsSame()
        {
            //async call
            var records1 = await this.fixture.Client.Query<ProfitVATcode>().GetAsync();
            //sync call
            var records2 = this.fixture.Client.Query<ProfitVATcode>().Get();

            Assert.True(records1.Length == records2.Length, "Async/sync failed.");

            //TODO how to compare recordS?
        }




    }
}

