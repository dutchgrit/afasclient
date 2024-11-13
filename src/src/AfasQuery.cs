using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{

    public enum QueryFilter
    {
        Equals = 1,
        GreaterOrEqual = 2,
        LessOrEqual = 3,
        GreaterThen = 4,
        LessThen = 5,
        Contains = 6,   // use %SEARCH% 
        NotEqual = 7,   // optie 1 : niet gelijk ; optie 2 : NotContains indien tekst met % % uitgevoerd is
        IsNull = 8,  // value moet wel ook met Null ingevoerd zijn dan. 
        IsNotNull = 9, // value meot een waarde wel hebben
        StartsWith = 10,
        NotStartWith = 12,
        EndsWith = 13,
        NotEndsWith = 14,

        // this is een placeholder Enum , not available in Afas
        // Afas implements the single "NotEqual" filter as two different functions
        // In case the filtervalue contains % % , it acts like a NotContains.
        NotContains = 1001
    }

    public class WhereClausule
    {

        public string field { get; set; }
        public string[] values { get; set; }

        public QueryFilter filter { get; set; }

        public WhereClausule(string field, string[] values, QueryFilter filter)
        {
            this.field = field;
            this.values = values;
            this.filter = filter;
        }

        public string QueryStringFields()
        {
            int vl = values.Length;
            if (vl == 0) { return ""; }
            if (vl == 1) { return field; }
            var result = field;
            for (int i = 1; i < vl; i++)
            {
                result += ";" + field;
            }
            return result;
        }

        public string QueryStringValues()
        {
            return String.Join(";", values);
        }

        public string QueryStringFilters()
        {
            int vl = values.Length;
            string strFilter = ((int)filter).ToString();
            if (vl == 0) { return ""; }
            if (vl == 1) { return strFilter; };
            var result = strFilter;
            for (int i = 1; i < vl; i++)
            {
                result += ";" + strFilter;
            }
            return result;
        }



    }

    public class OrderByItem
    {
        public string field { get; set; }
        public bool isDescending { get; set; }

        public OrderByItem(string field, bool isDescending = false)
        {
            this.field = field;
            this.isDescending = isDescending;
        }

        public override string ToString()
        {
            if (isDescending)
            {
                return "-" + field;
            }
            else
            {
                return field;
            }
        }
    }

    public class AfasQuery<T> where T : IGetEntity
    {

        private readonly IGeneralClient conn;

        private List<WhereClausule> WhereClausules = new List<WhereClausule>();
        private List<OrderByItem> OrderByItems = new List<OrderByItem>();

        private int qSkip = 0;
        private int qTake = 100;

        public AfasQuery(IGeneralClient conn)
        {
            this.conn = conn;
        }

        /// <summary>
        /// Returns the JsonProperty fieldname, if specified. Otherwise the propertyname is returned.
        /// </summary>
        /// <param name="fieldSelector"></param>
        /// <returns></returns>
        private string GetJsonPropertyName(Expression<Func<T, object>> fieldSelector)
        {

            if (fieldSelector == null) { throw new ArgumentNullException(); }

            //only lamdba's of type x=>x.property are valid expressions.

            MemberExpression memberExpression = null;

            if (fieldSelector.Body.NodeType == ExpressionType.Convert)
            {
                memberExpression = ((UnaryExpression)fieldSelector.Body).Operand as MemberExpression;
            }
            else if (fieldSelector.Body.NodeType == ExpressionType.MemberAccess)
            {
                memberExpression = fieldSelector.Body as MemberExpression;
            }

            if (memberExpression == null)
            {
                throw new ArgumentException("Expression is not a member access expression (x=>x.prop) ", nameof(GetJsonPropertyName));
            }

            //if (memberExpression is MemberExpression me)
            //{
            var pi = (PropertyInfo)memberExpression.Member;
            var attr = pi.GetCustomAttribute(typeof(JsonPropertyAttribute));
            if (attr != null)
            {
                var name = ((JsonPropertyAttribute)attr).PropertyName;
                return name;
            }
            return null;
            //}
            //else
            //{
            //    throw new ArgumentException("Invalid expression", nameof(OrderBy));
            //}
        }

        /// <summary>
        /// Returns the JsonProperty fieldname, if specified. Otherwise the propertyname is returned.
        /// </summary>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        private string GetJsonPropertyName(string propertyName)
        {
            var propinfo = typeof(T).GetProperty(propertyName);

            if (propinfo==null)
            {
                throw new ArgumentException($"Invalid propertyName {propertyName}", nameof(OrderBy));
            }
            
            var attr = propinfo.GetCustomAttribute(typeof(JsonPropertyAttribute));
            if (attr != null)
            {
                var name = ((JsonPropertyAttribute)attr).PropertyName;
                return name;
            }
            return propertyName;
        }



        public AfasQuery<T> OrderBy(Expression<Func<T, object>> fieldSelector)
        {
            var fieldName = GetJsonPropertyName(fieldSelector);
            var orderByItem = new OrderByItem(fieldName);
            this.OrderByItems.Add(orderByItem);
            return this;
        }

        public AfasQuery<T> OrderBy(string propertyName)
        {
            var fieldName = GetJsonPropertyName(propertyName);
            var orderByItem = new OrderByItem(fieldName);
            this.OrderByItems.Add(orderByItem);
            return this;
        }


        public AfasQuery<T> OrderByDesc(Expression<Func<T, object>> fieldSelector)
        {
            var fieldName = GetJsonPropertyName(fieldSelector);
            var orderByItem = new OrderByItem(fieldName, true);
            this.OrderByItems.Add(orderByItem);
            return this;
        }

        public AfasQuery<T> OrderByDesc(string propertyName)
        {
            var fieldName = GetJsonPropertyName(propertyName);
            var orderByItem = new OrderByItem(fieldName, true);
            this.OrderByItems.Add(orderByItem);
            return this;
        }



        private AfasQuery<T> ProcesWhereInternal(string propertyName, string[] values, QueryFilter filter)
        {
            var fieldName = GetJsonPropertyName(propertyName);
            return ProcesWhereInternalByFieldName(fieldName, values, filter);
        }

        private AfasQuery<T> ProcesWhereInternal(Expression<Func<T, object>> fieldSelector, string[] values, QueryFilter filter)
        {
            var fieldName = GetJsonPropertyName(fieldSelector);
            return ProcesWhereInternalByFieldName(fieldName, values, filter);
        }

        private AfasQuery<T> ProcesWhereInternalByFieldName(string fieldName, string[] values, QueryFilter filter)
        {

            //Preproces values, in case of Contains -> the values should be extended with % %
            switch (filter)
            {
                case QueryFilter.Contains:
                    values = values.Select(x => $"%{x}%").ToArray();
                    break;
                case QueryFilter.NotEqual:
                    break;
                case QueryFilter.IsNull:
                    values = values.Select(x => "null").ToArray();
                    break;
                case QueryFilter.IsNotNull:
                    break;
                case QueryFilter.StartsWith:
                    values = values.Select(x => $"{x}%").ToArray();
                    break;
                case QueryFilter.NotStartWith:
                    values = values.Select(x => $"%{x}%").ToArray();
                    break;
                case QueryFilter.EndsWith:
                    values = values.Select(x => $"%{x}").ToArray();
                    break;
                case QueryFilter.NotEndsWith:
                    values = values.Select(x => $"%{x}").ToArray();
                    break;
                case QueryFilter.NotContains:
                    filter = QueryFilter.NotEqual;
                    values = values.Select(x => $"%{x}%").ToArray();
                    break;
                default:
                    break;
            }

            WhereClausules.Add(new WhereClausule(fieldName, values, filter));
            return this;
        }

        public AfasQuery<T> WhereEquals(Expression<Func<T, object>> fieldSelector, params string[] values) =>
            ProcesWhereInternal(fieldSelector, values, QueryFilter.Equals);

        public AfasQuery<T> WhereEquals(string propertyName, params string[] values) =>
             ProcesWhereInternal(propertyName, values, QueryFilter.Equals);


        public AfasQuery<T> WhereGreaterOrEqual(Expression<Func<T, object>> fieldSelector, string value) =>
            ProcesWhereInternal(fieldSelector, new string[] { value }, QueryFilter.GreaterOrEqual);

        public AfasQuery<T> WhereGreaterOrEqual(string propertyName, string value) =>
            ProcesWhereInternal(propertyName, new string[] { value }, QueryFilter.GreaterOrEqual);



        public AfasQuery<T> WhereLessOrEqual(Expression<Func<T, object>> fieldSelector, string value) =>
            ProcesWhereInternal(fieldSelector, new string[] { value }, QueryFilter.LessOrEqual);
        public AfasQuery<T> WhereLessOrEqual(string propertyName, string value) =>
            ProcesWhereInternal(propertyName, new string[] { value }, QueryFilter.LessOrEqual);


        public AfasQuery<T> WhereGreaterThen(Expression<Func<T, object>> fieldSelector, string value) =>
            ProcesWhereInternal(fieldSelector, new string[] { value }, QueryFilter.GreaterThen);
        public AfasQuery<T> WhereGreaterThen(string propertyName, string value) =>
             ProcesWhereInternal(propertyName, new string[] { value }, QueryFilter.GreaterThen);


        public AfasQuery<T> WhereLessThen(Expression<Func<T, object>> fieldSelector, string value) =>
            ProcesWhereInternal(fieldSelector, new string[] { value }, QueryFilter.LessThen);
        public AfasQuery<T> WhereLessThen(string propertyName, string value) =>
            ProcesWhereInternal(propertyName, new string[] { value }, QueryFilter.LessThen);


        public AfasQuery<T> WhereContains(Expression<Func<T, object>> fieldSelector, params string[] values) =>
            ProcesWhereInternal(fieldSelector, values, QueryFilter.Contains);
        public AfasQuery<T> WhereContains(string propertyName, params string[] values) =>
            ProcesWhereInternal(propertyName, values, QueryFilter.Contains);


        public AfasQuery<T> WhereNotContains(Expression<Func<T, object>> fieldSelector, params string[] values) =>
           ProcesWhereInternal(fieldSelector, values, QueryFilter.NotContains);
        public AfasQuery<T> WhereNotContains(string propertyName, params string[] values) =>
           ProcesWhereInternal(propertyName, values, QueryFilter.NotContains);


        public AfasQuery<T> WhereIsNull(Expression<Func<T, object>> fieldSelector) =>
            ProcesWhereInternal(fieldSelector, new string[] { "null" }, QueryFilter.IsNull);
        public AfasQuery<T> WhereIsNull(string propertyName) =>
            ProcesWhereInternal(propertyName, new string[] { "null" }, QueryFilter.IsNull);


        public AfasQuery<T> WhereIsNotNull(Expression<Func<T, object>> fieldSelector) =>
            ProcesWhereInternal(fieldSelector, new string[] { "" }, QueryFilter.IsNotNull);
        public AfasQuery<T> WhereIsNotNull(string propertyName) =>
            ProcesWhereInternal(propertyName, new string[] { "" }, QueryFilter.IsNotNull);


        public AfasQuery<T> WhereStartsWith(Expression<Func<T, object>> fieldSelector, params string[] values) =>
          ProcesWhereInternal(fieldSelector, values, QueryFilter.StartsWith);
        public AfasQuery<T> WhereStartsWith(string propertyName, params string[] values) =>
             ProcesWhereInternal(propertyName, values, QueryFilter.StartsWith);

        public AfasQuery<T> WhereNotStartsWith(Expression<Func<T, object>> fieldSelector, params string[] values) =>
        ProcesWhereInternal(fieldSelector, values, QueryFilter.NotStartWith);
        public AfasQuery<T> WhereNotStartsWith(string propertyName, params string[] values) =>
        ProcesWhereInternal(propertyName, values, QueryFilter.NotStartWith);


        public AfasQuery<T> WhereEndsWith(Expression<Func<T, object>> fieldSelector, params string[] values) =>
          ProcesWhereInternal(fieldSelector, values, QueryFilter.EndsWith);
        public AfasQuery<T> WhereEndsWith(string propertyName, params string[] values) =>
          ProcesWhereInternal(propertyName, values, QueryFilter.EndsWith);


        public AfasQuery<T> WhereNotEndsWith(Expression<Func<T, object>> fieldSelector, params string[] values) =>
          ProcesWhereInternal(fieldSelector, values, QueryFilter.NotEndsWith);
        public AfasQuery<T> WhereNotEndsWith(string propertyName, params string[] values) =>
          ProcesWhereInternal(propertyName, values, QueryFilter.NotEndsWith);


        /// <summary>
        /// The number of records to skip.
        /// Default is 0.
        /// </summary>
        /// <param name="count"></param>
        /// <returns></returns>
        public AfasQuery<T> Skip(int count)
        {
            this.qSkip = count;
            return this;
        }


        /// <summary>
        /// The number of records to take. Default is 100.
        /// Set to -1 to get all available records.
        /// </summary>
        /// <param name="count"></param>
        /// <returns></returns>
        public AfasQuery<T> Take(int count)
        {
            this.qTake = count;
            return this;
        }


        public async Task<T[]> GetAsync()
        {
            var url = BuildURL();

            var queryResult = await this.conn.GetApiAsync<QueryResult<T>>(url);
            return queryResult.Row;
        }

        public async Task<T[]> GetChunkedAsync(int size = 10000)
        {
            List<T> finalResult = new List<T>();

            int lastLength = size;
            int chunkSize = size;

            qTake = chunkSize;
            qSkip = 0;
            while (lastLength== chunkSize)
            {
                var url = BuildURL();
                var queryResult = await this.conn.GetApiAsync<QueryResult<T>>(url);

                finalResult.AddRange(queryResult.Row);
                lastLength = queryResult.Row.Length;
                qSkip += lastLength;
            }

            return finalResult.ToArray();

        }


        public T[] Get() => AsyncHelpers.RunSync<T[]>(() => GetAsync());
        public T[] GetChunked(int size = 10000) => AsyncHelpers.RunSync<T[]>(() => GetChunkedAsync());

        private string BuildURL()
        {
            var connectorName = ConnectorNameAttribute.GetConnectorNameOfType<T>();

            var url = "connectors/" + connectorName;

            NameValueCollection queryString = System.Web.HttpUtility.ParseQueryString(string.Empty);

            if (WhereClausules.Count > 0)
            {
                queryString["filterfieldids"] = String.Join(",", WhereClausules.Select(x => x.QueryStringFields()));
                queryString["filtervalues"] = String.Join(",", WhereClausules.Select(x => x.QueryStringValues()));
                queryString["operatortypes"] = String.Join(",", WhereClausules.Select(x => x.QueryStringFilters()));
            }

            //build Order Clause
            if (OrderByItems.Count > 0)
            {
                queryString["orderbyfieldids"] = String.Join(",", OrderByItems);
            }

            //Max size: 2.048


            //Server only allows -1 in combination
            if (qTake==-1) { qSkip = -1; }
            if (qSkip==-1) { qTake = -1; }

            queryString["skip"] = qSkip.ToString();
            queryString["take"] = qTake.ToString();

            var addition = queryString.ToString();

            return addition.Length > 0 ? url + "?" + addition : url;

        }




    }
}


