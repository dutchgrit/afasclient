using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas
{
    public enum Environments
    {
        Production,
        Test,
        Accept
    }


   
    public static class EnvironmentExtensions
    {
        /// <summary>
        /// Converts environment to a string needed for building the Rest URL.
        /// </summary>
        /// <param name="env"></param>
        /// <returns></returns>
        public static string AsUrlAddition(this Environments env)
        {
            switch (env)
            {
                case Environments.Production:
                    return "";
                case Environments.Test:
                    return "test";
                case Environments.Accept:
                    return "accept";
                default:
                    throw new NotSupportedException("This Enum value is unsupported.");
            }
        }
    }
}
