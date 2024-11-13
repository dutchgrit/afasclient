using DutchGrit.Afas.DTO;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{

    /// <summary>
    /// Afas features a user-based OTP token module.
    /// OtpTokenClient needs an ApiKey and EnvironmentKey to request a Token usable for the AfasClient
    /// </summary>
    public class AfasOtpClient : AfasBase, IAfasOtpClient
    {

        private readonly string apiKey;
        private readonly string environmentKey;

        public AfasOtpClient(int MemberNumber, string ApiKey, string EnvironmentKey, Environments env = Environments.Production)
        {
            this.MemberNumber = MemberNumber;
            this.Environment = env;

            this.apiKey = ApiKey;
            this.environmentKey = EnvironmentKey;
            this.Token64 = "";
        }

        /// <inheritdoc/>
        public async Task<bool> GetOtpTokenRequest(string UserID)
        {
            var request = new OtpRequest
            {
                ApiKey = this.apiKey,
                ApiToken = this.environmentKey,       //Ja, dit klopt echt... Afas API naamgevings onlogica 
                UserId = UserID
            };

            var content = JsonConvert.SerializeObject(request);

            var res = await this.OtpPost("otprequest", content);
            var con = await res.Content.ReadAsStringAsync();

            //we verwachten geen response terug.. je krijgt hooguit een 201 terug.. 
            return true;
        }

        /// <inheritdoc/>
        public async Task<string> GetOtpTokenValidation(string UserID, string ValidationCode)
        {
            var request = new OtpValidation
            {
                ApiKey = this.apiKey,
                ApiToken = this.environmentKey,       //Ja, dit klopt echt... Afas API naamgevings onlogica 
                UserId = UserID,
                OTP = ValidationCode
            };

            var content = JsonConvert.SerializeObject(request);

            var res = await this.OtpPost("otpvalidation", content);
            res.EnsureSuccessStatusCode();
            if (res.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                throw new ValidationException("Invalid validation");
            }
            var con = await res.Content.ReadAsStringAsync();

            var response = JsonConvert.DeserializeObject<OtpValidationResponse>(con);
            return response.Token.Trim();
        }


    }
}
