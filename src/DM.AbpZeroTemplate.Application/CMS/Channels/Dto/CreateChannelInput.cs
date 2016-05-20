using Abp.Application.Services.Dto;
using Abp.Channels;
using System.ComponentModel.DataAnnotations;

namespace DM.AbpZeroTemplate.CMS.Channels.Dto
{
    public class CreateChannelInput : IInputDto
    {
        /// <summary>
        /// 父级ID
        /// </summary>
        public long? ParentId { get; set; }

        /// <summary>
        /// 展示名称
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
    }
}
