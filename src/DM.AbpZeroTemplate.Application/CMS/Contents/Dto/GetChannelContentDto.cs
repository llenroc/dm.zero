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
    public class GetChannelContentDto : AuditedEntityDto<long>
    {
        /// <summary>
        /// 应用
        /// </summary>
        public string AppName { get; set; }

        /// <summary>
        /// 栏目
        /// </summary>
        public string ChannelName { get; set; }

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
