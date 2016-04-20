using Abp.Application.Services;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.CMS.Channels.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DM.AbpZeroTemplate.CMS.Channels
{
    /// <summary>
    ///  栏目的领域服务
    /// </summary>
    public interface IChannelAppService : IApplicationService
    {
        /// <summary>
        /// 获取栏目
        /// </summary>
        /// <returns></returns>
        Task<ListResultOutput<ChannelDto>> GetChannels(IdInput<long> input);

        /// <summary>
        /// 创建栏目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<ChannelDto> CreateChannel(CreateChannelInput input);

        /// <summary>
        /// 更新栏目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<ChannelDto> UpdateChannel(UpdateChannelInput input);

        /// <summary>
        /// 移动栏目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<ChannelDto> MoveChannel(MoveChannelInput input);

        /// <summary>
        /// 删除栏目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task DeleteChannel(IdInput<long> input);
    }
}
