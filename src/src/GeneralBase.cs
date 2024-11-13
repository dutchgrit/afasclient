using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{
    public abstract class GeneralBase
    {

        
        public static LoggingHandler loggingHandler = new LoggingHandler(new HttpClientHandler());
        
        internal static HttpClient httpClientInternal = new HttpClient(loggingHandler, false);


        protected abstract string GetBaseUrl
        {
            get;
        }

        protected abstract Task<HttpResponseMessage> GetAuthHttp(string urlPath);

        protected abstract Task<HttpResponseMessage> SendAuthHttp(string urlPath, string payload, HttpMethod method);

        protected abstract Task<HttpResponseMessage> OtpPost(string urlPath, string content);

        public async Task<T> GetApiAsync<T>(string urlPath)
        {
            using (var res = await this.GetAuthHttp(urlPath))
            {
                res.EnsureSuccessStatusCode();
                var txt = await res.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<T>(txt);
            }
        }

        public async Task<UpdateResult<TResult>> SaveAsync<TResult>(IUpdateable<TResult> value, string subitem = "")
        {
            var payload = AfasUpdateWriter.Write(value, new IUpdateEntity[] { value });
            //if (IsDebug) { System.IO.File.WriteAllText("payload.json", payload); }
            var connector = ConnectorNameAttribute.GetConnectorName(value);

            var url = "connectors/" + connector;
            if (subitem != "")
            {
                url += "/" + subitem;
            }
            var res = await SendAuthHttp(url, payload, HttpMethod.Post);
            var con = await res.Content.ReadAsStringAsync();

            return res.IsSuccessStatusCode ? UpdateResult<TResult>.CreateSuccess(con) : UpdateResult<TResult>.CreateError(con);
        }

        public async Task<UpdateResult<TResult>> UpdateAsync<TResult>(IUpdateable<TResult> value, string subitem = "")
        {
            var payload = AfasUpdateWriter.Write(value, new IUpdateEntity[] { value });
            //if (IsDebug) { System.IO.File.WriteAllText("payload.json", payload); }
            var connector = ConnectorNameAttribute.GetConnectorName(value);

            var url = "connectors/" + connector;
            if (subitem != "")
            {
                url += "/" + subitem;
            }
            var res = await SendAuthHttp(url, payload, HttpMethod.Put);
            var con = await res.Content.ReadAsStringAsync();

            return res.IsSuccessStatusCode ? UpdateResult<TResult>.CreateSuccess(con) : UpdateResult<TResult>.CreateError(con);
        }
        
        // delete whole record, such as an entire knQuotation
        public async Task<UpdateResult<TResult>> DeleteAsync<TResult>(IUpdateable<TResult> value)
        {
            var connector = ConnectorNameAttribute.GetConnectorName(value);
            var keyField = KeyFieldAttribute.GetFieldName(value);
            var url = $"connectors/{connector}/{connector}/@{keyField}/{value.GetType().GetProperty(keyField)?.GetValue(value, null) ?? ""}";
            var res = await SendAuthHttp(url, "", HttpMethod.Delete);
            var con = await res.Content.ReadAsStringAsync();

            return res.IsSuccessStatusCode ? UpdateResult<TResult>.CreateSuccess(con) : UpdateResult<TResult>.CreateError(con);
        }



        /// <summary>
        /// Get a file from the Afas FileConnector
        /// </summary>
        /// <param name="FileID"></param>
        /// <param name="FileName"></param>
        /// <returns>null if the image is not found</returns>
        public async Task<FileInfo> GetFileAsync(string FileID, string FileName)
        {
            //this one is based on the FileConnector 
            //Refinery doet het eigenlijk zo: fileconnector/{FileID}?filenameuri={FileName}
            //maar dit alternatief werkt ook bij refinery.
            using (var res = await this.GetAuthHttp($"fileconnector/{FileID}/{FileName}"))
            {
                int code = (int)res.StatusCode;
                if (code >= 200 && code <= 299)
                {
                    var txt = await res.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<FileInfo>(txt);
                }
                if (res.StatusCode == HttpStatusCode.NotFound)
                {
                    return null;
                }
                //bij een andere reden, gewoon laten klappen!
                res.EnsureSuccessStatusCode();
                return null;
            }
        }


        public async Task<ImageInfo> GetImageAsync(int ImageID, ImageSizes imageSize, bool useNotFoundImage = true)
        {

            ///https://refinery.afaspocket.nl/imageconnector/25544?format=1&sendAsBinary=1&appuid=U81UFQS
            ///werkt ook zonder appuid en sendAsBinary ..
            /// TODO  : testen of de sendAsBinary ook werkt bij de gewone connector?

            using (var res = await this.GetAuthHttp($"imageconnector/{ImageID}?format={(int)imageSize}"))
            {
                int code = (int)res.StatusCode;
                if (code >= 200 && code <= 299)
                {
                    var txt = await res.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<ImageInfo>(txt);
                }
                if (res.StatusCode == HttpStatusCode.NotFound && useNotFoundImage)
                {
                    return ImageInfo.NotFoundImageInfo();
                }
                res.EnsureSuccessStatusCode();
                return null;
            }
        }

        //SYNC VERSIONS

        public ImageInfo GetImage(int ImageID, ImageSizes imageSize, bool useNotFoundImage = true) => AsyncHelpers.RunSync<ImageInfo>(() => GetImageAsync(ImageID, imageSize, useNotFoundImage));
        public FileInfo GetFile(string FileID, string FileName) => AsyncHelpers.RunSync<FileInfo>(() => GetFileAsync(FileID, FileName));

        public UpdateResult<TResult> Save<TResult>(IUpdateable<TResult> value, string subitem = "") => AsyncHelpers.RunSync<UpdateResult<TResult>>(() => SaveAsync(value, subitem));

        public UpdateResult<TResult> Update<TResult>(IUpdateable<TResult> value, string subitem = "") => AsyncHelpers.RunSync<UpdateResult<TResult>>(() => UpdateAsync(value, subitem));
        
        public UpdateResult<TResult> Delete<TResult>(IUpdateable<TResult> value) => AsyncHelpers.RunSync<UpdateResult<TResult>>(() => DeleteAsync(value));



    }

}
