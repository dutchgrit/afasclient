using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DutchGrit.Afas
{

    [AttributeUsage(AttributeTargets.Class, Inherited = true, AllowMultiple =false)]
    public class ConnectorNameAttribute : Attribute
    {

        public string ConnectorName { get; private set; }

        public  ConnectorNameAttribute(string name)
        {
            this.ConnectorName = name;
        }

        public static string GetConnectorName<T>(T obj)
        {
            var myAttribute = GetAttribute(obj);
            if (myAttribute != null)
            {
                return myAttribute.ConnectorName;
            }
            return null;
        }

        public static string GetConnectorNameOfType<T>()
        {
            var myAttribute = GetAttributeOfType<T>();
            if (myAttribute != null)
            {
                return myAttribute.ConnectorName;
            }
            return null;
        }

        private static ConnectorNameAttribute GetAttribute<T>(T obj)
        {
            return obj.GetType()
               .GetCustomAttributes(typeof(ConnectorNameAttribute), true)
               .FirstOrDefault() as ConnectorNameAttribute;
        }


        private static ConnectorNameAttribute GetAttributeOfType<T>()
        {
            return typeof(T)
               .GetCustomAttributes(typeof(ConnectorNameAttribute), true)
               .FirstOrDefault() as ConnectorNameAttribute;
        }


    }



}
