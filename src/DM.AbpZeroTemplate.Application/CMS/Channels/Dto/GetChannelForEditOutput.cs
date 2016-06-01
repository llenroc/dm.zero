using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.CMS.Templates.Dto;
using System;
using System.Collections;
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
            ChannelTemplates = new ArrayList();
            ContentTemplates = new ArrayList();
            ModelTypes = new ArrayList();
            LinkTypes = new ArrayList();
        }

        /// <summary>
        /// 栏目模板集合
        /// </summary>
        public ArrayList ChannelTemplates { get; set; }

        /// <summary>
        /// 内容模板集合
        /// </summary>
        public ArrayList ContentTemplates { get; set; }

        /// <summary>
        /// 内容模型集合
        /// </summary>
        public ArrayList ModelTypes { get; set; }

        /// <summary>
        /// 链接类型集合
        /// </summary>
        public ArrayList LinkTypes { get; set; }
    }
}
