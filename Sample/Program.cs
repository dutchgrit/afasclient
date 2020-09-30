using DutchGrit.Afas;
using System;
using System.Threading.Tasks;

namespace ConsoleSample
{
    class Program
    {
        static async Task<int> Main(string[] args)
        {

            //If you don't have a token , you can generate one
            var otpclient = new AfasOtpClient(12345, "api-key", "environment-key");

            //Request the otp valdiation code, which is send by mail by Afas.
            await otpclient.GetOtpTokenRequest("john@somecompany.ext");

            //Assume you received validation code 123456 by mail, you can request a token. 
            var token = await otpclient.GetOtpTokenValidation("john@somecompany.ext", "123456");


            //With a token, you can start working with the AfasClient
            var client = new AfasClient(00000, "token",Environments.Test);


            var session = client.GetSessionInfo();
            Console.WriteLine($"ConnectorName: {session.Info.ApplicationName}");
            Console.WriteLine($"EnvironmentID: {session.Info.EnvironmentID}");
            Console.WriteLine($"Group        : {session.Info.Group}");


            //overview of GetConnectors.
            foreach (var conn in session.GetConnectors)
            {
                Console.WriteLine($"{conn.Id} - {conn.Description}");
            }

            //Request a file
            var fileInfo = await client.GetFileAsync("test", "invoice001.pdf");

            if (fileInfo!=null)
            {
                var bytes = Convert.FromBase64String(fileInfo.FileDataBase64);
            };



            

            return 0;
        }
    }
}
