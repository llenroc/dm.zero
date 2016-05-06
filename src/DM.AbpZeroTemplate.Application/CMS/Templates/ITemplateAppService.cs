using Abp.Application.Services;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.CMS.Templates.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DM.AbpZeroTemplate.CMS.Templates
{
    /// <summary>
    /// 内容领域服务
    /// </summary>
    public interface ITemplateAppService : IApplicationService
    {
        /// <summary>
        /// 根据栏目ID，获取内容
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<PagedResultOutput<GetAppTemplateDto>> GetTemplates(GetAppTemplateInput input);

        /// <summary>
        /// 创建内容
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<TemplateDto> CreateTemplate(CreateTemplateInput input);

        /// <summary>
        /// 更新内容
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<TemplateDto> UpdateTemplate(UpdateTemplateInput input);

        /// <summary>
        /// 删除栏目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task DeleteTemplate(IdInput<long> input);

        /// <summary>
        /// 获取模板内容
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        Task<string> GetTemplateContent(IdInput<long> input);
    }
}
