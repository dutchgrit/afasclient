using System;
using System.Collections.Generic;
using System.Text;


namespace DutchGrit.Afas.Tests
{
   
    public class ClientFixture : IDisposable
    {
        public static Environments AfasEnvironment = Environments.Production;
        public static int MemberID = 88562;
        public static string Token = "<token><version>1</version><data>B8F63A37938B4AAA85214337F0B9B664E7F1ACAF4B692E567D437CA2A7EFE495</data></token>";

        public IAfasClient Client { get; private set; }
        public GetConMetaInfo Meta { get; set; }
        public ClientFixture()
        {
            Client = new AfasClient(MemberID, Token, AfasEnvironment);
        }
        public void Dispose() { }
    }
}
