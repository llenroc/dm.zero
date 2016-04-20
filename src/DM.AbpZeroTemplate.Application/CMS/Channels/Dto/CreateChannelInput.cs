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
        /// 应用ID
        /// </summary>
        public long AppId { get; set; }
    }
}
