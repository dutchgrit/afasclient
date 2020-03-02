using DutchGrit.Afas;
using System;

namespace ConsoleSample
{
    class Program
    {
        static void Main(string[] args)
        {
            
            var client = new AfasClient(00, "token",Environments.Test);



            var session = client.GetSessionInfo();
            var sessioninfo = session.Info;

            Console.WriteLine($"ConnectorName: {sessioninfo.ApplicationName}");
            Console.WriteLine($"EnvironmentID: {sessioninfo.EnvironmentID}");
            Console.WriteLine($"Group        : {sessioninfo.Group}");


            foreach (var conn in session.GetConnectors)
            {
                Console.WriteLine($"{conn.Id} - {conn.Description}");
            }




        }
    }
}
