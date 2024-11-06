using DutchGrit.Afas.DTO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{
    public class RefineryOtpClient : RefineryBase
    {


        public RefineryOtpClient(string LoginKey)
        {
            this.LoginKey = LoginKey;

            var key = Encoding.ASCII.GetBytes(LoginKey);
            this.AuthAfasKey = "AfasKey " + Convert.ToBase64String(key);
        }

        /// <summary>
        /// Performs a OTP request post on /otprequest endpoint
        /// </summary>
        /// <param name="UserID">Emailaddress of user</param>
        /// <returns></returns>
        public async Task<bool> GetOtpTokenRequest(string AfasUser)
        {
            var request = new 
            {
               userid = AfasUser
            };

            var content = JsonConvert.SerializeObject(request);

            var res = await this.OtpPost("otprequest", content);
            var con = await res.Content.ReadAsStringAsync();

            //we verwachten geen response terug.. je krijgt hooguit een 201 terug.. 
            return true;
        }

        public async Task<OtpValidationResponse> GetOtpTokenValidation(string AfasUser, string ValidationCode)
        {
            var request = new 
            {
                userid = AfasUser,
                otp = ValidationCode
            };

            var content = JsonConvert.SerializeObject(request);

            var res = await this.OtpPost("otpvalidation", content);
            res.EnsureSuccessStatusCode();
            //if (res.StatusCode == System.Net.HttpStatusCode.NoContent)
            //{
            //    throw new ValidationException("Invalid validation");
            //}
            var con = await res.Content.ReadAsStringAsync();

            var response = JsonConvert.DeserializeObject<OtpValidationResponse>(con);
            // Afas adds additional enter in Token.
            response.Token = response.Token.Trim();
            return response;
        }


      


    }
}
