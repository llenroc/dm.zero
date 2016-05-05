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

namespace DM.AbpZeroTemplate.CMS.Channels
{
    [AbpAuthorize(AppPermissions.Pages_CMS_Channels)]
    public class ChannelAppService : AbpZeroTemplateAppServiceBase, IChannelAppService
    {
        private readonly ChannelManager _channelManager;
        private readonly ContentManager _contentManager;

        public ChannelAppService(ChannelManager channelManager, ContentManager contentManager)
        {
            _channelManager = channelManager;
            _contentManager = contentManager;
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
            if (channel != null)
            {
                channel.DisplayName = input.DisplayName;
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
