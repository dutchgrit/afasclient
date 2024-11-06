using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas.Tests
{
    public class RefineryFixture
    {
  
        //public static string Token = "<token><version>1</version><data>B8F63A37938B4AAA85214337F0B9B664E7F1ACAF4B692E567D437CA2A7EFE495</data></token>";

        public IRefineryClient Client { get; private set; }
        
        public RefineryFixture()
        {

            var userID = "29:16sTwcHhlhjho2dcdzWfdOViK9cWMl7GNJbwD73t7CtHqZtZWLbHc7MpCwwzpEnSauvys6SgDYArzalVqZ6nGPA";
            var cryptToken = "Og+dvn3oeKQci7HVqFK4w3Swon385aaRB78a2RWQ2rXKjQQsWMWbSK/rUuXS9yUaq21V355MxX9EG6Z1Ssc7/q2vLG2uEZjbVeu9ghi5kejf1dBjNGJ/DaxxzzQzjwVqmgfDP5eHnCGG0MOftRViXrw7hjsp7+CZ01DBvFs/tTs=";

            var token = SimpleCrypt.Decrypt(cryptToken, userID);
            //var appuid = "MZDTYT";

            Client = new RefineryClient("MZDTYT", token, "UTGJDPM");

            

        }
        public void Dispose() { }
    }
}
