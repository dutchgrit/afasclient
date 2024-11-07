using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas.CodeGen
{
    public static class Helpers
    {
        public static string DataTypeToType(string dataType, int controlType)
        {
            switch (dataType)
            {
                case "blob":
                    //Remark (Opmerkingen) fields (controlType=23) are easier to handle as string.
                    //return controlType == 23 ? "string" : "byte[]";
                    //22/6/2020 it is better to always return string
                    // - afas only reports a blob in case the string is unlimitted in size
                    // - afas will expect Base64 string as soon as it talks about files.
                    return "string";
                case "boolean":
                    return "bool?";
                case "string":
                    return "string";
                case "int":
                    return "int?";
                case "date":
                    return "DateTime?";
                case "decimal":
                    return "double?";
                default:
                    throw new NotImplementedException($"datatype : {dataType} is unknown and cannot be converted.");

            }
        }

        //this list of comparisons should match the DataTypeToType output list.
        public static Type TypeStringToType(string type)
        {
            if (type == "string") return typeof(string);
            if (type == "byte[]") return typeof(byte[]);
            if (type == "bool?") return typeof(bool?);
            if (type == "int?") return typeof(int?);
            if (type == "double?") return typeof(double?);
            if (type == "DateTime?") return typeof(DateTime?);

            throw new NotImplementedException($"TypeString {type} not found in {nameof(TypeStringToType)} function.");
        }

        public  static string GetInterfaceString(bool isConnected)
        {
            return isConnected ? nameof(IUpdateable<object>)+ "<object>" : nameof(IUpdateEntity);
        }


    }
}
