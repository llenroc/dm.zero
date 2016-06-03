using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;
using System.Web.Mvc;
using Abp.Auditing;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.IO.Extensions;
using Abp.Runtime.Session;
using Abp.UI;
using Abp.Web.Models;
using Abp.Web.Mvc.Authorization;
using Abp.Web.Mvc.Models;
using DM.AbpZeroTemplate.IO;
using DM.AbpZeroTemplate.Net.MimeTypes;
using DM.AbpZeroTemplate.Storage;
using Abp.Contents;
using Abp.Apps;
using Abp.Core.Utils;
using Abp.Core.IO;

namespace DM.AbpZeroTemplate.Web.Controllers
{
    [AbpMvcAuthorize]
    public class ContentController : AbpZeroTemplateControllerBase
    {
        private readonly ContentManager _contentManager;
        private readonly AppManager _appManager;

        public ContentController(
            ContentManager contentManager,
            AppManager appManager)
        {
            _contentManager = contentManager;
            _appManager = appManager;
        }

        #region ImageUrl
        [DisableAuditing]
        public async Task<FileResult> GetContentImage(int contentId)
        {
            var content = await _contentManager.ContentRepository.GetAsync(contentId);
            if (content.ImageUrl == null)
            {
                return GetDefaultContentVideo();
            }

            return GetContentImage(content.ImageUrl);
        }

        [DisableAuditing]
        public FileResult GetContentImage(string path)
        {
            if (path.IsNullOrEmpty())
            {
                return GetDefaultContentVideo();
            }

            return File(PathUtils.MapPath(path), MimeTypeNames.ImageJpeg);
        }

        [UnitOfWork]
        public virtual async Task<JsonResult> ChangeContentImage(long contentId)
        {
            try
            {
                //Check input
                if (Request.Files.Count <= 0 || Request.Files[0] == null)
                {
                    throw new UserFriendlyException(L("ContentPicture_Change_Error"));
                }

                var file = Request.Files[0];

                if (file.ContentLength > 5242880) //1M.
                {
                    throw new UserFriendlyException(L("ContentPicture_Warn_SizeLimit"));
                }

                //Get content
                var content = await _contentManager.ContentRepository.GetAsync(contentId);
                var app = await _appManager.AppRepository.GetAsync(content.AppId);

                //Delete old picture
                if (!string.IsNullOrEmpty(content.ImageUrl))
                {
                    FileUtils.DeleteFileIfExists(PathUtils.MapPath(PageUtils.GetUrlWithAppDir(app, content.ImageUrl)));
                }

                //Save new picture
                var fileInfo = new FileInfo(file.FileName);
                string fileName = string.Format("{0}{1}", Guid.NewGuid(), fileInfo.Extension);
                var imageUrl = _contentManager.GetImageUrlWithAppDir(app, fileName);//包含AppDir
                var absoluteImageUrl = PathUtils.MapPath(imageUrl);
                DirectoryUtils.CreateDirectoryIfNotExists(absoluteImageUrl);
                file.SaveAs(absoluteImageUrl);

                //Return success
                return Json(new MvcAjaxResponse());
            }
            catch (UserFriendlyException ex)
            {
                //Return error message
                return Json(new MvcAjaxResponse(new ErrorInfo(ex.Message)));
            }
        }

        public async Task<JsonResult> UploadContentImage(long appId, long? contentId)
        {
            try
            {
                //Check input
                if (Request.Files.Count <= 0 || Request.Files[0] == null)
                {
                    throw new UserFriendlyException(L("ContentPicture_Change_Error"));
                }

                var file = Request.Files[0];

                if (file.ContentLength > 5242880) //1MB.
                {
                    throw new UserFriendlyException(L("ContentPicture_Warn_SizeLimit"));
                }

                //Check file type & format
                var fileImage = Image.FromStream(file.InputStream);
                if (!fileImage.RawFormat.Equals(ImageFormat.Jpeg) && !fileImage.RawFormat.Equals(ImageFormat.Png))
                {
                    throw new ApplicationException("Uploaded file is not an accepted image file !");
                }

                Content content = null;
                if (contentId.HasValue)
                {
                    content = await _contentManager.ContentRepository.GetAsync(contentId.Value);
                }
                if (content == null)
                {
                    content = new Content();
                }
                var app = await _appManager.AppRepository.GetAsync(appId);

                //Delete old picture
                if (!string.IsNullOrEmpty(content.ImageUrl))
                {
                    FileUtils.DeleteFileIfExists(PathUtils.MapPath(PageUtils.GetUrlWithAppDir(app, content.ImageUrl)));
                }

                //Save new picture
                var fileInfo = new FileInfo(file.FileName);
                string fileName = string.Format("{0}{1}", Guid.NewGuid(), fileInfo.Extension);
                var imageUrl = _contentManager.GetImageUrlWithAppDir(app, fileName);//包含AppDir
                var absoluteImageUrl = PathUtils.MapPath(imageUrl);
                DirectoryUtils.CreateDirectoryIfNotExists(absoluteImageUrl);
                file.SaveAs(absoluteImageUrl);

                return Json(new MvcAjaxResponse(new { fileName = imageUrl }));
            }
            catch (UserFriendlyException ex)
            {
                return Json(new MvcAjaxResponse(new ErrorInfo(ex.Message)));
            }
        }

        private FileResult GetDefaultContentImage()
        {
            return File(Server.MapPath("~/Common/Images/default-content-picture.png"), MimeTypeNames.ImagePng);
        }
        #endregion

        #region VideoUrl
        [DisableAuditing]
        public async Task<FileResult> GetContentVideo(int contentId)
        {
            var content = await _contentManager.ContentRepository.GetAsync(contentId);
            if (content.VideoUrl == null)
            {
                return GetDefaultContentVideo();
            }

            return GetContentVideo(content.VideoUrl);
        }

        [DisableAuditing]
        public FileResult GetContentVideo(string path)
        {
            if (path.IsNullOrEmpty())
            {
                return GetDefaultContentVideo();
            }

            return File(PathUtils.MapPath(path), MimeTypeNames.VideoMp4);
        }

        [UnitOfWork]
        public virtual async Task<JsonResult> ChangeContentVideo(long appId, long? contentId)
        {
            try
            {
                //Check input
                if (Request.Files.Count <= 0 || Request.Files[0] == null)
                {
                    throw new UserFriendlyException(L("ContentPicture_Change_Error"));
                }

                var file = Request.Files[0];

                if (file.ContentLength > 5242880) //1M.
                {
                    throw new UserFriendlyException(L("ContentPicture_Warn_SizeLimit"));
                }

                //Get content
                Content content = null;
                if (contentId.HasValue)
                {
                    content = await _contentManager.ContentRepository.GetAsync(contentId.Value);
                }
                if (content == null)
                {
                    content = new Content();
                }
                var app = await _appManager.AppRepository.GetAsync(appId);

                //Delete old picture
                if (!string.IsNullOrEmpty(content.VideoUrl))
                {
                    FileUtils.DeleteFileIfExists(PathUtils.MapPath(PageUtils.GetUrlWithAppDir(app, content.VideoUrl)));
                }

                //Save new picture
                var fileInfo = new FileInfo(file.FileName);
                string fileName = string.Format("{0}{1}", Guid.NewGuid(), fileInfo.Extension);
                var videoUrl = _contentManager.GetVideoUrlWithAppDir(app, fileName);//包含AppDir
                var absoluteVideoUrl = PathUtils.MapPath(videoUrl);
                DirectoryUtils.CreateDirectoryIfNotExists(absoluteVideoUrl);
                file.SaveAs(absoluteVideoUrl);

                //Return success
                return Json(new MvcAjaxResponse());
            }
            catch (UserFriendlyException ex)
            {
                //Return error message
                return Json(new MvcAjaxResponse(new ErrorInfo(ex.Message)));
            }
        }

        public async Task<JsonResult> UploadContentVideo(long appId, long? contentId)
        {
            try
            {
                //Check input
                if (Request.Files.Count <= 0 || Request.Files[0] == null)
                {
                    throw new UserFriendlyException(L("ContentPicture_Change_Error"));
                }

                var file = Request.Files[0];

                if (file.ContentLength > 5242880) //1MB.
                {
                    throw new UserFriendlyException(L("ContentPicture_Warn_SizeLimit"));
                }

                Content content = null;
                if (contentId.HasValue)
                {
                    content = await _contentManager.ContentRepository.GetAsync(contentId.Value);
                }
                if (content == null)
                {
                    content = new Content();
                }
                var app = await _appManager.AppRepository.GetAsync(appId);

                //Delete old picture
                if (!string.IsNullOrEmpty(content.VideoUrl))
                {
                    FileUtils.DeleteFileIfExists(PathUtils.MapPath(PageUtils.GetUrlWithAppDir(app, content.VideoUrl)));
                }

                //Save new picture
                var fileInfo = new FileInfo(file.FileName);
                string fileName = string.Format("{0}{1}", Guid.NewGuid(), fileInfo.Extension);
                var videoUrl = _contentManager.GetVideoUrlWithAppDir(app, fileName);//包含AppDir
                var absoluteVideoUrl = PathUtils.MapPath(videoUrl);
                DirectoryUtils.CreateDirectoryIfNotExists(absoluteVideoUrl);
                file.SaveAs(absoluteVideoUrl);

                return Json(new MvcAjaxResponse(new { fileName = videoUrl }));
            }
            catch (UserFriendlyException ex)
            {
                return Json(new MvcAjaxResponse(new ErrorInfo(ex.Message)));
            }
        }

        private FileResult GetDefaultContentVideo()
        {
            return File(Server.MapPath("~/Common/Videos/default-content-picture.png"), MimeTypeNames.ImagePng);
        }
        #endregion


        #region FileUrl
        [DisableAuditing]
        public async Task<FileResult> GetContentFile(int contentId)
        {
            var content = await _contentManager.ContentRepository.GetAsync(contentId);
            if (content.FileUrl == null)
            {
                return GetDefaultContentFile();
            }

            return GetContentFile(content.FileUrl);
        }

        [DisableAuditing]
        public FileResult GetContentFile(string path)
        {
            if (path.IsNullOrEmpty())
            {
                return GetDefaultContentFile();
            }

            return File(PathUtils.MapPath(path), MimeTypeNames.ImagePng);
        }

        [UnitOfWork]
        public virtual async Task<JsonResult> ChangeContentFile(long contentId)
        {
            try
            {
                //Check input
                if (Request.Files.Count <= 0 || Request.Files[0] == null)
                {
                    throw new UserFriendlyException(L("ContentPicture_Change_Error"));
                }

                var file = Request.Files[0];

                if (file.ContentLength > 5242880) //1M.
                {
                    throw new UserFriendlyException(L("ContentPicture_Warn_SizeLimit"));
                }

                //Get content
                var content = await _contentManager.ContentRepository.GetAsync(contentId);
                var app = await _appManager.AppRepository.GetAsync(content.AppId);

                //Delete old picture
                if (!string.IsNullOrEmpty(content.FileUrl))
                {
                    FileUtils.DeleteFileIfExists(PathUtils.MapPath(PageUtils.GetUrlWithAppDir(app, content.FileUrl)));
                }

                //Save new picture
                var fileInfo = new FileInfo(file.FileName);
                string fileName = string.Format("{0}{1}", Guid.NewGuid(), fileInfo.Extension);
                var fileUrl = _contentManager.GetFileUrlWithAppDir(app, fileName);//包含AppDir
                var absoluteFileUrl = PathUtils.MapPath(fileUrl);
                DirectoryUtils.CreateDirectoryIfNotExists(absoluteFileUrl);
                file.SaveAs(absoluteFileUrl);

                //Return success
                return Json(new MvcAjaxResponse());
            }
            catch (UserFriendlyException ex)
            {
                //Return error message
                return Json(new MvcAjaxResponse(new ErrorInfo(ex.Message)));
            }
        }

        public async Task<JsonResult> UploadContentFile(long appId, long? contentId)
        {
            try
            {
                //Check input
                if (Request.Files.Count <= 0 || Request.Files[0] == null)
                {
                    throw new UserFriendlyException(L("ContentPicture_Change_Error"));
                }

                var file = Request.Files[0];

                if (file.ContentLength > 5242880) //1MB.
                {
                    throw new UserFriendlyException(L("ContentPicture_Warn_SizeLimit"));
                }

                Content content = null;
                if (contentId.HasValue)
                {
                    content = await _contentManager.ContentRepository.GetAsync(contentId.Value);
                }
                if (content == null)
                {
                    content = new Content();
                }
                var app = await _appManager.AppRepository.GetAsync(appId);

                //Delete old picture
                if (!string.IsNullOrEmpty(content.FileUrl))
                {
                    FileUtils.DeleteFileIfExists(PathUtils.MapPath(PageUtils.GetUrlWithAppDir(app, content.FileUrl)));
                }

                //Save new picture
                var fileInfo = new FileInfo(file.FileName);
                string fileName = string.Format("{0}{1}", Guid.NewGuid(), fileInfo.Extension);
                var fileUrl = _contentManager.GetFileUrlWithAppDir(app, fileName);//包含AppDir
                var absoluteFileUrl = PathUtils.MapPath(fileUrl);
                DirectoryUtils.CreateDirectoryIfNotExists(absoluteFileUrl);
                file.SaveAs(absoluteFileUrl);

                return Json(new MvcAjaxResponse(new { fileName = fileUrl }));
            }
            catch (UserFriendlyException ex)
            {
                return Json(new MvcAjaxResponse(new ErrorInfo(ex.Message)));
            }
        }

        private FileResult GetDefaultContentFile()
        {
            return File(Server.MapPath("~/Common/Files/default-content-picture.png"), MimeTypeNames.ImagePng);
        }
        #endregion

    }
}