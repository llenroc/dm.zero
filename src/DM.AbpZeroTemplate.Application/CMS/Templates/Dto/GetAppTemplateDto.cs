using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Templates;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DM.AbpZeroTemplate.CMS.Templates.Dto
{
    /// <summary>
    /// 内容传输对象
    /// </summary>
    [AutoMapFrom(typeof(Template))]
    public class GetAppTemplateDto : AuditedEntityDto<long>
    {
        /// <summary>
        /// 应用
        /// </summary>
        public string AppName { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 后缀
        /// </summary>
        public string Extension { get; set; }

        /// <summary>
        /// 类型
        /// </summary>
        public string Type { get; set; }
    }
}
