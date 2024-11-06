using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace DutchGrit.Afas.Tests
{
    public class ImageTests : IClassFixture<ClientFixture>
    {
        ClientFixture fixture;
        public ImageTests(ClientFixture fixture) { this.fixture = fixture; }

        [Fact]
        public async void GetImageNotFound()
        {

            //image id 1 bestaat niet 
            var x = await fixture.Client.GetImageAsync(1, ImageSizes.Medium);

            Assert.StartsWith("image", x.MimeType);
            Assert.True(x.IsNotFound);

        }

        [Fact]
        public async void GetImage()
        {

            //image id 1 bestaat niet 
            var x = await fixture.Client.GetImageAsync(25449, ImageSizes.Medium);

            Assert.StartsWith("image", x.MimeType);
            Assert.False(x.IsNotFound);
        }

        [Fact]
        public async void GetImageShouldThrow()
        {

            await Assert.ThrowsAsync<System.Net.Http.HttpRequestException>( ()=>fixture.Client.GetImageAsync(1, ImageSizes.Medium, false));
            //image id 1 bestaat niet 
         
        }







    }
}
