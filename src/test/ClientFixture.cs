using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;


namespace DutchGrit.Afas.Tests
{
   
    public class ClientFixture : IDisposable
    {
        public static Environments AfasEnvironment = Environments.Production;

        public string Token { get; private set; }

        public int MemberId { get; private set; }

        public IAfasClient Client { get; private set; }
        
        public GetConMetaInfo Meta { get; set; }
        
        public ClientFixture()
        {
            // The startupPath is simply one way of getting the path to
            // appettings.json. We could hard code tha path if necessary
            // or use any other method to obtain the path to appsettings.json
            var filepath = typeof(ClientFixture).Assembly.Location;
            var StartupPath = Path.GetDirectoryName(filepath);

            var config = new ConfigurationBuilder()
                .SetBasePath(StartupPath)
                .AddJsonFile("appsettings.json", optional: true)
                .AddUserSecrets<ClientFixture>()
                .AddEnvironmentVariables()
                .Build();

            Token = config["AfasToken"] ?? Environment.GetEnvironmentVariable("AfasToken");
            MemberId = int.Parse((config["AfasMemberId"] ?? Environment.GetEnvironmentVariable("AfasMemberId")) ?? string.Empty);
            AfasEnvironment = int.TryParse(config["AfasEnvironment"] ?? Environment.GetEnvironmentVariable("AfasEnvironment"), out var env) && env is >= 0 and <= 2 
                ? (Environments)Enum.Parse(typeof(Environments), env.ToString())
                : Environments.Production;
            Client = new AfasClient(MemberId, Token, AfasEnvironment);
        }
        public void Dispose() { }
    }
}
