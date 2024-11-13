using System.Threading.Tasks;

namespace DutchGrit.Afas
{
    public interface IAfasOtpClient
    {
        /// <summary>
        /// Request Afas to send an email with a OTP Validation code. This code can be used to get a full token with the OTP validation method.
        /// </summary>
        /// <param name="UserID">UserID is either the afas user (12345.name) or emailaddress. </param>
        /// <returns>Always returns true to prevent guessing of correct userid's. </returns>
        Task<bool> GetOtpTokenRequest(string UserID);

        /// <summary>
        /// Validate the OTP code for the user
        /// </summary>
        /// <param name="UserID">UserID is either the afas user (12345.name) or an emailaddress.</param>
        /// <param name="ValidationCode">The code received by mail</param>
        /// <returns>If succefull, it returns a valid Token</returns>
        Task<string> GetOtpTokenValidation(string UserID, string ValidationCode);
    }
}