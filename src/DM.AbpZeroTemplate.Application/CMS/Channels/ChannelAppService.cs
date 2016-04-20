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

namespace DM.AbpZeroTemplate.CMS.Channels
{
    [AbpAuthorize(AppPermissions.Pages_CMS_Channels)]
    public class ChannelAppService : AbpZeroTemplateAppServiceBase, IChannelAppService
    {
        private readonly ChannelManager _channelManager;
        private readonly AppManager _appManager;
        private readonly IRepository<Channel, long> _channelRepository;

        public ChannelAppService(ChannelManager channelManager, AppManager appManager, IRepository<Channel, long> channelRepository)
        {
            _channelManager = channelManager;
            _appManager = appManager;
            _channelRepository = channelRepository;
        }

        /// <summary>
        /// 创建栏目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [AbpAuthorize(AppPermissions.Pages_CMS_Channels_Create)]
        public async Task<ChannelDto> CreateChannel(CreateChannelInput input)
        {
            var channel = new Channel(input.AppId, input.DisplayName, input.ParentId);
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
            var query = from ch in _channelRepository.GetAll()
                                .Where(c => c.AppId == input.Id)
                        select new { ch, contentContent = 0 };
            var items = await query.ToListAsync();
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
        /// 移动栏目
        /// </summary>
        /// <param name="input">appId</param>
        /// <returns></returns>
        [AbpAuthorize(AppPermissions.Pages_CMS_Channels_Move)]
        public async Task<ChannelDto> MoveChannel(MoveChannelInput input)
        {
            await _channelManager.MoveAsync(input.Id, input.NewParentId);
            return await CreateChannelDto(
                await _channelRepository.GetAsync(input.Id)
                );
        }

        /// <summary>
        /// 修改栏目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public async Task<ChannelDto> UpdateChannel(UpdateChannelInput input)
        {
            var channel = await _channelRepository.GetAsync(input.Id);
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
