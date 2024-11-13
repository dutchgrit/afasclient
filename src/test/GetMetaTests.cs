using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DutchGrit.Afas.Tests
{
    public class GetMetaTests : IClassFixture<ClientFixture>
    {

        public static string ConnectorID = "Profit_VAT_code";


        ClientFixture fixture;
        public GetMetaTests(ClientFixture fixture) { this.fixture = fixture; }


        [Fact]
        public async Task MetaInfo()
        {
            var info = fixture.Client.GetSessionInfo();

            var x = await fixture.Client.GetMetaDataGetConAsync(ConnectorID);
            Assert.True(x.Name == ConnectorID, "GetConMetaInfo.Name is different then ConnectorID.");
            Assert.True(x.Description.Length > 0, "GetConMetaInfo.Description field is empty.");
            Assert.True(x.Fields.Length > 0, "GetConMetaInfo.Fields is empty.");
            fixture.Meta = x;
        }

        [Theory]
        [InlineData(0)]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        [InlineData(4)]
        [InlineData(5)]
        [InlineData(6)]
        [InlineData(7)]
        public async Task MetaInfoFields(int field)
        {
            if (fixture.Meta == null)
            {
                //load the data
                fixture.Meta = await fixture.Client.GetMetaDataGetConAsync(ConnectorID);
            }

            var f = fixture.Meta.Fields[field];
            Assert.True(f.ControlType > 0, "GetConMetaInfoField.ControlType is invalid.");
            Assert.True(f.DataType.Length > 0, "GetConMetaInfoField.DataType is invalid.");
            Assert.True(f.FieldId.Length > 0, "GetConMetaInfoField.FieldID is invalid.");
            Assert.True(f.Id.Length > 0, "GetConMetaInfoField.ID is invalid.");
            Assert.True(f.Length > 0, "GetConMetaInfoField.Length is invalid.");
        }
    }
}
