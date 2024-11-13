using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas.CodeGen
{

    /// <summary>
    /// Code generator for Afas UpdateConnectors. 
    /// Call .GenerateCode()
    /// </summary>
    public class UpdateGenerator
    {

        private IAfasClient connection;

        public UpdateGenerator(IAfasClient connection)
        {
            this.connection = connection;
        }


        private void FlattenList( List<UpdateConMetaInfo> classes, UpdateConMetaInfo current)
        {
            if (current==null) { return; }
            if (current.Objects == null) { return; }
            foreach (var sub in current.Objects)
            {
                classes.Add(sub);
                FlattenList(classes, sub);
            }
        }

   
        public List<UpdateConMetaInfo> GenerateList() => AsyncHelpers.RunSync<List<UpdateConMetaInfo>>(() => GenerateListAsync());

        public async Task<List<UpdateConMetaInfo>> GenerateListAsync()
        {
           
            //Generate code for all the UpdateConnectors found in Session Info
            var si = await this.connection.GetSessionInfoAsync();

            var classes = new List<UpdateConMetaInfo>();

            if (si.UpdateConnectors != null)
            {
                foreach (var connector in si.UpdateConnectors)
                {
                    var meta = await connection.GetMetaDataUpdConAsync(connector.Id);
                    meta.IsConnected = true;
                    classes.Add(meta);
                    FlattenList(classes, meta);
                }
            }

            var finalList = new List<UpdateConMetaInfo>();

            //classes contains all found classes , either in UpdateConnector itself, 
            //or in one of the Objects or subobjects.
            //need to combine the classes into a single "id" list .. 
            foreach (var className in classes.Select(x => x.Name).Distinct())
            {
                var infosPerClass = classes.Where(x => x.Name == className).ToList();

                foreach (var brotherInfo in infosPerClass.Skip(1))
                {
                    infosPerClass[0].MergeWith(brotherInfo);
                }
                finalList.Add(infosPerClass[0]);
                //ProcesConnector(infosPerClass[0]);
            }
            return finalList;
        }       

    }
}
