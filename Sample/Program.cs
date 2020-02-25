using DutchGrit.Afas;
using System;

namespace ConsoleSample
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            var client = new AfasClient(00, "token",Environments.Test);

            var session = client.GetSessionInfo();
            //session.Info.ApplicationName;
            //session.Info.EnvironmentID;
            //session.Info.Group;

            foreach (var getConnector in session.GetConnectors)
            {
                Console.WriteLine(getConnector.Id);
                Console.WriteLine(getConnector.Description);
            }


        }
    }
}
