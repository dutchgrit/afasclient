using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas.Refinery
{

   

    public class DataQuery<T> where T : IDataEntity
    {

        private List<FieldValue> FieldValues = new List<FieldValue>();

        private readonly IRefineryClient client;

        private bool SkipWasSet = false;
        private bool TakeWasSet = false;

        public DataQuery(IRefineryClient client)
        {
            this.client = client;
        }

        public  DataQuery<T> Where(string fieldName, string value)
        {
            FieldValues.Add(new FieldValue { FieldId = fieldName, Value = value });
            return this;
        }

        public DataQuery<T> Where(string fieldName, int value)
        {
            FieldValues.Add(new FieldValue { FieldId = fieldName, Value = value.ToString() });
            return this;
        }

        public DataQuery<T> Skip(int value)
        {
            if (SkipWasSet)
            {
                throw new ArgumentOutOfRangeException("Can only set skip once!");
            }
            FieldValues.Add(new FieldValue { FieldId = "Skip", Value = value.ToString() });
            SkipWasSet = true;
            return this;
        }

        public DataQuery<T> Take(int value)
        {
            if (TakeWasSet)
            {
                throw new ArgumentOutOfRangeException("Can only set skip once!");
            }
            FieldValues.Add(new FieldValue { FieldId = "Take", Value = value.ToString() });
            TakeWasSet = true;
            return this;
        }


        public async Task<T[]> GetAsync()
        {
            var url = BuildURL();
            var queryResult = await this.client.GetApiAsync<DataQueryResult<T>>(url);
            return queryResult.Rows;
        }

        private string BuildURL()
        {
            var connectorName = ConnectorNameAttribute.GetConnectorNameOfType<T>();
            var url = "dataconnectors/" + connectorName;

            NameValueCollection queryString = System.Web.HttpUtility.ParseQueryString(string.Empty);
            if (FieldValues.Count > 0)
            {
                queryString["fieldids"] = String.Join(",", FieldValues.Select(x => x.FieldId));
                queryString["values"] = String.Join(",", FieldValues.Select(x => x.Value));
            }
            var addition = queryString.ToString();

            return addition.Length > 0 ? url + "?" + addition : url;

        }

    }
}
