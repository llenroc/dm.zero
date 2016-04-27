using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Contents;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DM.AbpZeroTemplate.CMS.Contents.Dto
{
    /// <summary>
    /// 内容传输对象
    /// </summary>
    [AutoMapFrom(typeof(Content))]
    public class ContentDto : AuditedEntityDto<long>
    {
        /// <summary>
        /// 应用ID
        /// </summary>
        public long AppId { get; set; }

        /// <summary>
        /// 栏目ID
        /// </summary>
        public long ChannelId { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string ContentText { get; set; }
    }
}
