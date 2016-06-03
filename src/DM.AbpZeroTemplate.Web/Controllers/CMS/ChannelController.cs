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
using Abp.Channels;
using Abp.Apps;
using Abp.Core.Utils;
using Abp.Core.IO;

namespace DM.AbpZeroTemplate.Web.Controllers
{
    [AbpMvcAuthorize]
    public class ChannelController : AbpZeroTemplateControllerBase
    {
        private readonly ChannelManager _channelManager;
        private readonly AppManager _appManager;

        public ChannelController(
            ChannelManager channelManager,
            AppManager appManager)
        {
            _channelManager = channelManager;
            _appManager = appManager;
        }

        [DisableAuditing]
        public async Task<FileResult> GetChannelImage(int channelId)
        {
            var channel = await _channelManager.ChannelRepository.GetAsync(channelId);
            if (channel.ImageUrl == null)
            {
                return GetDefaultChannelPicture();
            }

            return GetChannelImage(channel.ImageUrl);
        }

        [DisableAuditing]
        public FileResult GetChannelImage(string path)
        {
            if (path.IsNullOrEmpty())
            {
                return GetDefaultChannelPicture();
            }

            return File(PathUtils.MapPath(path), MimeTypeNames.ImageJpeg);
        }

        [UnitOfWork]
        public virtual async Task<JsonResult> ChangeChannelImage(long channelId)
        {
            try
            {
                //Check input
                if (Request.Files.Count <= 0 || Request.Files[0] == null)
                {
                    throw new UserFriendlyException(L("ChannelPicture_Change_Error"));
                }

                var file = Request.Files[0];

                if (file.ContentLength > 5242880) //1M.
                {
                    throw new UserFriendlyException(L("ChannelPicture_Warn_SizeLimit"));
                }

                //Get channel
                var channel = await _channelManager.ChannelRepository.GetAsync(channelId);
                var app = await _appManager.AppRepository.GetAsync(channel.AppId);

                //Delete old picture
                if (!string.IsNullOrEmpty(channel.ImageUrl))
                {
                    FileUtils.DeleteFileIfExists(PathUtils.MapPath(PageUtils.GetUrlWithAppDir(app, channel.ImageUrl)));
                }

                //Save new picture
                var fileInfo = new FileInfo(file.FileName);
                string fileName = string.Format("{0}{1}", Guid.NewGuid(), fileInfo.Extension);
                var imageUrl = _channelManager.GetImageUrlWithAppDir(app, fileName);//°üº¬AppDir
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

        public async Task<JsonResult> UploadChannelImage(long appId, long? channelId)
        {
            try
            {
                //Check input
                if (Request.Files.Count <= 0 || Request.Files[0] == null)
                {
                    throw new UserFriendlyException(L("ChannelPicture_Change_Error"));
                }

                var file = Request.Files[0];

                if (file.ContentLength > 5242880) //1MB.
                {
                    throw new UserFriendlyException(L("ChannelPicture_Warn_SizeLimit"));
                }

                //Check file type & format
                var fileImage = Image.FromStream(file.InputStream);
                if (!fileImage.RawFormat.Equals(ImageFormat.Jpeg) && !fileImage.RawFormat.Equals(ImageFormat.Png))
                {
                    throw new ApplicationException("Uploaded file is not an accepted image file !");
                }

                Channel channel = null;
                if (channelId.HasValue)
                {
                    channel = await _channelManager.ChannelRepository.GetAsync(channelId.Value);
                }
                if (channel == null)
                {
                    channel = new Channel();
                }
                var app = await _appManager.AppRepository.GetAsync(appId);



                //Delete old picture
                if (!string.IsNullOrEmpty(channel.ImageUrl))
                {
                    FileUtils.DeleteFileIfExists(PathUtils.MapPath(PageUtils.GetUrlWithAppDir(app, channel.ImageUrl)));
                }

                //Save new picture
                var fileInfo = new FileInfo(file.FileName);
                string fileName = string.Format("{0}{1}", Guid.NewGuid(), fileInfo.Extension);
                var imageUrl = _channelManager.GetImageUrlWithAppDir(app, fileName);//°üº¬AppDir
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

        private FileResult GetDefaultChannelPicture()
        {
            return File(Server.MapPath("~/Common/Images/default-channel-picture.png"), MimeTypeNames.ImagePng);
        }

    }
}