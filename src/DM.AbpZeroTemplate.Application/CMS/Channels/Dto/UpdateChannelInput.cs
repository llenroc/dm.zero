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

    }
}
