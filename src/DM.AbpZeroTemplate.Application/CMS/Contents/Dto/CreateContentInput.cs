using Abp.Application.Services.Dto;
using Abp.Contents;
using System.ComponentModel.DataAnnotations;

namespace DM.AbpZeroTemplate.CMS.Contents.Dto
{
    public class CreateContentInput : IInputDto
    {
        public long AppId { get; set; }

        public long ChannelId { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        [Required]
        [StringLength(Content.MaxTitleLength)]
        public string Title { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string ContentText { get; set; }
    }
}
