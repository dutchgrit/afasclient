using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

[assembly: CollectionBehavior(DisableTestParallelization = true)]
namespace DutchGrit.Afas.Tests
{
    public class MetaTests : IClassFixture<ClientFixture>
    {

        public static string ConnectorID = "Profit_VAT_code";


        ClientFixture fixture;
        public MetaTests(ClientFixture fixture) { this.fixture = fixture; }


        private void SetJsonStrict()
        {
            JsonConvert.DefaultSettings = () => new JsonSerializerSettings
            {
                MissingMemberHandling = MissingMemberHandling.Error,
            };
        }

        private void SetJsonDefault()
        {
            JsonConvert.DefaultSettings = null;
        }


        [Fact]
        public async Task SessionInfoAsync()
        {
            SetJsonStrict();
            try
            {
                await this.fixture.Client.GetSessionInfoAsync();
            }
            finally
            {
                SetJsonDefault();
            }
        }

        [Fact]
        public async Task VersionAsync()
        {
            SetJsonStrict();
            try
            {
                await this.fixture.Client.GetVersionAsync();
            }
            finally
            {
                SetJsonDefault();
            }
        }

        
        [Fact]
        public async Task GetMetaDataGetConAsync()
        {
            SetJsonStrict();
            try
            {
                await this.fixture.Client.GetMetaDataGetConAsync(ConnectorID);
            }
            finally
            {
                SetJsonDefault();
            }
        }

        [Fact]
        public async Task GetQueryAsync()
        {
            SetJsonStrict();
            try
            {
                await this.fixture.Client.Query<ProfitVATcode>().Take(1).GetAsync();
            }
            finally
            {
                SetJsonDefault();
            }
        }





    }
}
