using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace DutchGrit.Afas.CodeGen
{
    public static class Utils
    {


        public static string StripUnderscore(string name)
        {
            return name.Replace("_", "");
        }

        public static string FixFields(string fieldName)
        {
            return fieldName.Replace(".", "").Replace("-", "");
        }



        /// <summary>
        /// Replace the diacritics in the supplied string
        /// Example 'créâ' becomes 'crea'
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string RemoveDiacritics(this string text)
        {
            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }


        /// <summary>
        /// Convert string into a valid UpperCase C# fieldname.
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string AsCodeName(this string text)
        {
            bool needUpper = true;
            StringBuilder sb = new StringBuilder();
            foreach (var c in text)
            {
                if (Char.IsLetterOrDigit(c))
                {
                    sb.Append((needUpper) ? Char.ToUpper(c) : c);
                    needUpper = false;
                }
                else
                {
                    needUpper = true;
                }
            }
            var result = sb.ToString();
            //result cannot start with a digit.
            if (Char.IsDigit(result[0])) { result = "_" + result; }
            return result;
        }

    }
}
