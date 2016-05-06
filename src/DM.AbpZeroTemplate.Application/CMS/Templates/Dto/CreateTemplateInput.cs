using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Templates;
using System.ComponentModel.DataAnnotations;

namespace DM.AbpZeroTemplate.CMS.Templates.Dto
{
    [AutoMapFrom(typeof(Template))]
    public class CreateTemplateInput : IInputDto
    {
        public long AppId { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        [Required]
        [StringLength(Template.MaxTitleLength)]
        public string Title { get; set; }

        /// <summary>
        /// 名称
        /// </summary>
        [Required]
        [StringLength(Template.MaxNameLength)]
        public string Name { get; set; }

        /// <summary>
        /// 类型
        /// </summary>
        [Required]
        [StringLength(Template.MaxTypeLength)]
        public string Type { get; set; }

        /// <summary>
        /// 后缀
        /// </summary>
        public string Extension { get; set; }

        /// <summary>
        /// 内容
        /// </summary>
        public string TemplateContent { get; set; }
    }
}
