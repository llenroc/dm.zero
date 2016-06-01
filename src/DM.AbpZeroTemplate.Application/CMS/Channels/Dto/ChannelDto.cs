using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Channels;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace DM.AbpZeroTemplate.CMS.Channels.Dto
{
    /// <summary>
    ///  栏目数据传输对象<see cref="Channel"/>
    /// </summary>
    [AutoMapFrom(typeof(Channel))]
    public class ChannelDto : AuditedEntityDto<long>
    {
        /// <summary>
        /// appID
        /// </summary>
        public long AppId { get; set; }

        /// <summary>
        ///  父级ID，可以null
        /// </summary>
        public long? ParentId { get; set; }

        /// <summary>
        ///  栏目编码
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        ///  展示名称
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// 内容数量
        /// </summary>
        public int ContentCount { get; set; }

        /// <summary>
        /// 栏目模板Id
        /// </summary>
        public long ChannelTemplateId { get; set; }

        /// <summary>
        /// 内容模板Id
        /// </summary>
        public long ContentTemplateId { get; set; }

        //是否首页
        public bool IsIndex { get; set; }

        /// <summary>
        /// 内容模型
        /// </summary>
        public string ModelType { get; set; }

        /// <summary>
        /// 栏目生成文件名称
        /// </summary>
        public string FilePath { get; set; }

        /// <summary>
        /// 栏目链接
        /// </summary>
        public string LinkUrl { get; set; }

        /// <summary>
        /// 栏目链接类型
        /// </summary>
        public string LinkType { get; set; }

        /// <summary>
        /// 栏目图片
        /// </summary>
        public string ImageUrl { get; set; }

        /// <summary>
        /// 关键字
        /// </summary>
        public string Keywords { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 栏目内容
        /// </summary>
        public string Content { get; set; }
    }
}
