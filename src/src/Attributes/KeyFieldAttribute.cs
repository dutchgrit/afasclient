using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DutchGrit.Afas
{

    [AttributeUsage(AttributeTargets.Class, Inherited = true, AllowMultiple = true)]
    public class KeyFieldAttribute : Attribute
    {

        public string FieldName { get; private set; }

        public KeyFieldAttribute(string fieldName)
        {
            this.FieldName = fieldName;
        }

        public static bool HasAttribute<T>(T obj)
        {
            var myAttribute = GetAttribute(obj);
            return (myAttribute != null);
        }

        public static string GetFieldName<T>(T obj)
        {
            var myAttribute = GetAttribute(obj);
            if (myAttribute != null)
            {
                return myAttribute.FieldName;
            }
            return null;
        }

        public static string[] GetFieldNames<T>(T obj)
        {
            var myAttributes = GetAttributes(obj);
            if (myAttributes != null)
            {
                return myAttributes.Select(x=>x.FieldName).ToArray();
            }
            return null;
        }




        private static KeyFieldAttribute GetAttribute<T>(T obj)
        {
            return obj.GetType()
               .GetCustomAttributes(typeof(KeyFieldAttribute), true)
               .FirstOrDefault() as KeyFieldAttribute;
        }

        private static KeyFieldAttribute[] GetAttributes<T>(T obj)
        {
           
            return obj.GetType()
               .GetCustomAttributes(typeof(KeyFieldAttribute), true).Cast<KeyFieldAttribute>().ToArray();
               //.FirstOrDefault() as KeyFieldAttribute;
        }

    }
}
