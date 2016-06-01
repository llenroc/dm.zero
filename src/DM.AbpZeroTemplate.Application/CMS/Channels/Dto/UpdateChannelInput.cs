using Abp.Application.Services.Dto;
using Abp.Channels;
using System.ComponentModel.DataAnnotations;

namespace DM.AbpZeroTemplate.CMS.Channels.Dto
{
    public class UpdateChannelInput : IInputDto
    {
        /// <summary>
        ///  当前栏目Id
        /// </summary>
        public long Id { get; set; }

        /// <summary>
        ///  展示名称
        /// </summary>
        [Required]
        [StringLength(Channel.MaxDisplayNameLength)]
        public string DisplayName { get; set; }

        /// <summary>
        /// 栏目模板ID
        /// </summary>
        public long? ChannelTemplateId { get; set; }

        /// <summary>
        /// 内容模板ID
        /// </summary>
        public long? ContentTemplateId { get; set; }

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
