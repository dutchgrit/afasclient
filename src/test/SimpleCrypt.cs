using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace DutchGrit.Afas.Tests
{
    public static class SimpleCrypt
    {

        public static string Decrypt(string cipherText, string passPhrase)
        {
            //byte[] bytes1 = Encoding.ASCII.GetBytes("tu89geji340t89u2");  deze gebruikt heeel de wereld..
            byte[] bytes1 = Encoding.ASCII.GetBytes("tu12geji430t65u4");
            byte[] buffer = Convert.FromBase64String(cipherText);
            byte[] bytes2 = new PasswordDeriveBytes(passPhrase, (byte[])null).GetBytes(32);
            var rijndaelManaged = Aes.Create("AesManaged");
            rijndaelManaged.Mode = CipherMode.CBC;
            using (MemoryStream memoryStream = new MemoryStream(buffer))
            {
                using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, rijndaelManaged.CreateDecryptor(bytes2, bytes1), CryptoStreamMode.Read))
                {
                    byte[] numArray = new byte[buffer.Length];
                    int count = cryptoStream.Read(numArray, 0, numArray.Length);
                    return Encoding.UTF8.GetString(numArray, 0, count);
                }
            }
        }

        public static string Encrypt(string plainText, string passPhrase)
        {
            if (String.IsNullOrEmpty(plainText)) { return ""; }
            byte[] bytes1 = Encoding.UTF8.GetBytes("tu12geji430t65u4");
            byte[] bytes2 = Encoding.UTF8.GetBytes(plainText);
            byte[] bytes3 = new PasswordDeriveBytes(passPhrase, (byte[])null).GetBytes(32);
            var rijndaelManaged = Aes.Create("AesManaged");
            rijndaelManaged.Mode = CipherMode.CBC;
            using (MemoryStream memoryStream = new MemoryStream())
            {
                using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, rijndaelManaged.CreateEncryptor(bytes3, bytes1), CryptoStreamMode.Write))
                {
                    cryptoStream.Write(bytes2, 0, bytes2.Length);
                    cryptoStream.FlushFinalBlock();
                    return Convert.ToBase64String(memoryStream.ToArray());
                }
            }
        }


    }
}
