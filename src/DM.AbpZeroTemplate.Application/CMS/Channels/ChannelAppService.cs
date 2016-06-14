using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.CMS.Channels.Dto;
using Abp.Authorization;
using DM.AbpZeroTemplate.Authorization;
using Abp.Channels;
using Abp.Apps;
using Abp.AutoMapper;
using Abp.Domain.Repositories;
using System.Data.Entity;
using Abp.Contents;
using Abp.CMS;
using Abp.Templates;
using Abp.Core.Enums;
using DM.AbpZeroTemplate.CMS.Templates.Dto;
using Abp.Core.Utils;
using Abp.Core.IO;

namespace DM.AbpZeroTemplate.CMS.Channels
{
    [AbpAuthorize(AppPermissions.Pages_CMS_Channels)]
    public class ChannelAppService : AbpZeroTemplateAppServiceBase, IChannelAppService
    {
        private readonly AppManager _appManager;
        private readonly ChannelManager _channelManager;
        private readonly ContentManager _contentManager;
        private readonly TemplateManager _templateManager;

        public ChannelAppService(AppManager appManager, ChannelManager channelManager, ContentManager contentManager, TemplateManager templateManager)
        {
            _appManager = appManager;
            _channelManager = channelManager;
            _contentManager = contentManager;
            _templateManager = templateManager;
        }

        /// <summary>
        /// 创建栏目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(AppPermissions.Pages_CMS_Channels_Create)]
        public async Task<ChannelDto> CreateChannel(CreateChannelInput input)
        {
            var channel = new Channel(AppId, input.DisplayName, input.ParentId);
            var app = await _appManager.GetByIdAsync(channel.AppId);

            if (input.ChannelTemplateId.HasValue)
            {
                channel.ChannelTemplateId = input.ChannelTemplateId.Value;
            }
            if (input.ContentTemplateId.HasValue)
            {
                channel.ContentTemplateId = input.ContentTemplateId.Value;
            }

            channel.Content = input.Content;
            channel.Description = input.Description;
            channel.FilePath = input.FilePath;
            channel.ImageUrl = PageUtils.GetUrlWithoutAppDir(app, input.ImageUrl);
            channel.Keywords = input.Keywords;
            channel.LinkType = input.LinkType;
            channel.LinkUrl = input.LinkUrl;
            channel.ModelType = input.ModelType;

            await _channelManager.CreateAsync(channel);
            await CurrentUnitOfWork.SaveChangesAsync();
            return channel.MapTo<ChannelDto>();
        }

        /// <summary>
        /// 删除栏目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(AppPermissions.Pages_CMS_Channels_Delete)]
        public async Task DeleteChannel(IdInput<long> input)
        {
            await _channelManager.DeleteAsync(input.Id);
        }

        public async Task<ChannelDto> GetChannel(IdInput<long> input)
        {
            var channel = await _channelManager.ChannelRepository.GetAsync(input.Id);
            var app = await _appManager.GetByIdAsync(channel.AppId);
            if (!string.IsNullOrEmpty(channel.ImageUrl))
            {
                channel.ImageUrl = PageUtils.GetUrlWithAppDir(app, channel.ImageUrl);
            }
            return channel.MapTo<ChannelDto>();
        }

        /// <summary>
        ///  获取添加编辑栏目时的初始值
        /// </summary>
        /// <returns></returns>
        public async Task<GetChannelForEditOutput> GetChannelForEdit()
        {
            GetChannelForEditOutput result = new GetChannelForEditOutput();

            var query = from t in _templateManager.TemplateRepository.GetAll()
                        where t.Type == ETemplateType.ChannelTemplate.ToString()
                        select t;
            var channelTems = query.ToList();

            query = from t in _templateManager.TemplateRepository.GetAll()
                    where t.Type == ETemplateType.ContentTemplate.ToString()
                    select t;
            var contentTems = query.ToList();

            channelTems.ForEach(
                item =>
                {
                    result.ChannelTemplates.Add(new { Key = item.Id, Value = item.Title });
                }
                );
            contentTems.ForEach(
                item =>
                {
                    result.ContentTemplates.Add(new { Key = item.Id, Value = item.Title });
                }
            );

            EModelTypeUtils.LoadList(result.ModelTypes);
            ELinkTypeUtils.LoadList(result.LinkTypes);

            return result;
        }

        /// <summary>
        /// 获取栏目
        /// </summary>
        /// <param name="input">appId</param>
        /// <returns></returns>
        [AbpAuthorize(AppPermissions.Pages_CMS_Channels)]
        public async Task<ListResultOutput<ChannelDto>> GetChannels(IdInput<long> input)
        {
            if (input.Id == 0)
                input.Id = AppId;

            var query = from ch in _channelManager.ChannelRepository.GetAll()
                        join con in _contentManager.ContentRepository.GetAll() on ch.Id equals con.ChannelId
                        into g
                        where ch.AppId == input.Id
                        select new { ch, contentContent = g.Count() };
            var items = query.ToList();
            return new ListResultOutput<ChannelDto>(items.Select(
                    item =>
                    {
                        var dto = item.ch.MapTo<ChannelDto>();
                        dto.ContentCount = item.contentContent;
                        return dto;
                    }
                ).ToList()
                );
        }

        /// <summary>
        /// 获取树形结构的栏目列表
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<ListResultOutput<ChannelDto>> GetChannelsForTree(IdInput<long> input)
        {
            if (input.Id == 0)
                input.Id = AppId;

            var query = from ch in _channelManager.ChannelRepository.GetAll()
                        where ch.AppId == input.Id
                        select ch;
            var items = query.ToList();
            return new ListResultOutput<ChannelDto>(items.Select(
                    item =>
                    {
                        var dto = item.MapTo<ChannelDto>();
                        return dto;
                    }
                ).ToList()
                );
        }

        /// <summary>
        /// 是否在栏目下
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<bool> IsInChannel(IsInChannelInput input)
        {
            var content = await _contentManager.ContentRepository.GetAsync(input.ContentId);
            return await Task.FromResult<bool>(content.ChannelId == input.ChannelId);
        }

        /// <summary>
        /// 移动栏目
        /// </summary>
        /// <param name="input">appId</param>
        /// <returns></returns>
        [AbpAuthorize(AppPermissions.Pages_CMS_Channels_Move)]
        public async Task<ChannelDto> MoveChannel(MoveChannelInput input)
        {
            await _channelManager.MoveAsync(input.Id, input.NewParentId);
            return await CreateChannelDto(
                await _channelManager.ChannelRepository.GetAsync(input.Id)
                );
        }

        /// <summary>
        /// 修改栏目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<ChannelDto> UpdateChannel(UpdateChannelInput input)
        {
            var channel = await _channelManager.ChannelRepository.GetAsync(input.Id);
            var app = await _appManager.GetByIdAsync(channel.AppId);
            if (channel != null)
            {
                if (input.ChannelTemplateId.HasValue)
                {
                    channel.ChannelTemplateId = input.ChannelTemplateId.Value;
                }
                if (input.ContentTemplateId.HasValue)
                {
                    channel.ContentTemplateId = input.ContentTemplateId.Value;
                }

                channel.DisplayName = input.DisplayName;
                channel.Content = input.Content;
                channel.Description = input.Description;
                channel.FilePath = input.FilePath;
                channel.ImageUrl = PageUtils.GetUrlWithoutAppDir(app, input.ImageUrl);
                channel.Keywords = input.Keywords;
                channel.LinkType = input.LinkType;
                channel.LinkUrl = input.LinkUrl;
                channel.ModelType = input.ModelType;

                await _channelManager.UpdateAsync(channel);
            }
            return await CreateChannelDto(channel);
        }

        /// <summary>
        ///  根据Channel创建Dto
        /// </summary>
        /// <param name="channel"></param>
        /// <returns></returns>
        private async Task<ChannelDto> CreateChannelDto(Channel channel)
        {
            if (channel != null)
            {
                var dto = channel.MapTo<ChannelDto>();
                dto.ContentCount = 0;//需要从数据库中读取
                return dto;
            }
            else
                return null;
        }
    }
}
