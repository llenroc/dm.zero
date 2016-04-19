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

namespace DM.AbpZeroTemplate.CMS.Channels
{
    [AbpAuthorize(AppPermissions.Pages_CMS_Channels)]
    public class ChannelAppService : AbpZeroTemplateAppServiceBase, IChannelAppService
    {
        private readonly ChannelManager _channelManager;

        public Task<ChannelDto> CreateChannel(CreateChannelInput input)
        {
            throw new NotImplementedException();
        }

        public Task DeleteChannel(IdInput<long> input)
        {
            throw new NotImplementedException();
        }

        public Task<ListResultOutput<ChannelDto>> GetChannels(IdInput<long> input)
        {
            throw new NotImplementedException();
        }

        public Task<ChannelDto> MoveChannel(MoveChannelInput input)
        {
            throw new NotImplementedException();
        }

        public Task<ChannelDto> UpdateChannel(UpdateChannelInput input)
        {
            throw new NotImplementedException();
        }
    }
}
