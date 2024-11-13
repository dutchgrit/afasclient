using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DutchGrit.Afas
{
    public class UpdateResult<T>
    {


        public static UpdateResult<T> CreateSuccess(string result)
        {
            return new UpdateResult<T>
            {
                IsSuccess = true,
                ErrorMessage = "",
                Result = JsonConvert.DeserializeObject<T>(result)
            };
        }

        public static UpdateResult<T> CreateError(string msg)
        {
            return new UpdateResult<T>
            {
                IsSuccess = false,
                ErrorMessage = msg
            };
        }
        

        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }
        public T Result { get; set; }

        private UpdateResult()
        {

        }

    }
}
