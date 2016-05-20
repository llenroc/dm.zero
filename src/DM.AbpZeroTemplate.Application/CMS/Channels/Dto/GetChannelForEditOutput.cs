using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.CMS.Templates.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DM.AbpZeroTemplate.CMS.Channels.Dto
{
    public class GetChannelForEditOutput : IOutputDto
    {
        public GetChannelForEditOutput()
        {
            ChannelTemplates = new List<TemplateDto>();
            ContentTemplates = new List<TemplateDto>();
        }

        /// <summary>
        /// 栏目模板集合
        /// </summary>
        public IList<TemplateDto> ChannelTemplates { get; set; }

        /// <summary>
        /// 内容模板集合
        /// </summary>
        public IList<TemplateDto> ContentTemplates { get; set; }
    }
}
