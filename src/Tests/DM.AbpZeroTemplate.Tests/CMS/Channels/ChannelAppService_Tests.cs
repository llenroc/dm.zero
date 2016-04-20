using DM.AbpZeroTemplate.CMS.Channels;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DM.AbpZeroTemplate.Tests.CMS.Channels
{
    public class ChannelAppService_Tests : AppTestBase
    {
        private readonly IChannelAppService _channelAppService;

        public ChannelAppService_Tests()
        {
            _channelAppService = Resolve<IChannelAppService>();
        }

        [Fact]
        public async Task Test_GetChannels()
        {
            var output = await _channelAppService.GetChannels(new Abp.Application.Services.Dto.IdInput<long>(0));
            output.Items.Count.ShouldBe(7);
        }
    }
}
