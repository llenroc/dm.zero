using Abp.Application.Services;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.CMS.Contents.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace DM.AbpZeroTemplate.CMS.Contents
{
    /// <summary>
    /// 内容领域服务
    /// </summary>
    public interface IContentAppService : IApplicationService
    {
        /// <summary>
        /// 根据栏目ID，获取内容
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<PagedResultOutput<GetChannelContentDto>> GetContents(GetChannelContentsInput input);

        /// <summary>
        /// 创建内容
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<ContentDto> CreateContent(CreateContentInput input);

        /// <summary>
        /// 更新内容
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<ContentDto> UpdateContent(UpdateContentInput input);

        /// <summary>
        ///  转移内容
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<ContentDto> MoveContent(MoveContentInput input);

        /// <summary>
        /// 删除栏目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task DeleteContent(IdInput<long> input);

        /// <summary>
        /// 获取内容信息
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<ContentDto> GetContent(IdInput<long> input);
    }
}
