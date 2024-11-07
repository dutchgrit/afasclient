using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas.CodeGen
{
    public class GetGenerator
    {

        private IAfasClient connection;

        public GetGenerator(IAfasClient connection)
        {
            this.connection = connection;
        }

        public async Task<List<GetConMetaInfo>> GenerateListAsync()
        {
            //Generate code for all the GetConnectors found in Session Info
            var si = await this.connection.GetSessionInfoAsync();

            var res = new List<GetConMetaInfo>();
            if (si.GetConnectors != null)
            {
                foreach (var connector in si.GetConnectors)
                {
                    var meta = await connection.GetMetaDataGetConAsync(connector.Id);
                    res.Add(meta);
                }
            }
            return res;
        }


        public List<GetConMetaInfo> GenerateList() => AsyncHelpers.RunSync<List<GetConMetaInfo>>(() => GenerateListAsync());

  
    }
}
