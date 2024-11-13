using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DutchGrit.Afas
{
    public interface IGeneralClient
    {

        AfasQuery<T> Query<T>() where T : IGetEntity;

        Task<T> GetApiAsync<T>(string url);

      
        Task<UpdateResult<TResult>> SaveAsync<TResult>(IUpdateable<TResult> value, string subitem = "");

        Task<UpdateResult<TResult>> UpdateAsync<TResult>(IUpdateable<TResult> value, string subitem = "");

        Task<FileInfo> GetFileAsync(string FileID, string FileName);

        Task<ImageInfo> GetImageAsync(int ImageID, ImageSizes imageSize, bool useNotFoundImage = true);


        //SYNC VERSIONS


        FileInfo GetFile(string FileID, string FileName);

        ImageInfo GetImage(int ImageID, ImageSizes imageSize, bool useNotFoundImage = true);

        UpdateResult<TResult> Save<TResult>(IUpdateable<TResult> value, string subitem = "");

        UpdateResult<TResult> Update<TResult>(IUpdateable<TResult> value, string subitem = "");

    }
}
