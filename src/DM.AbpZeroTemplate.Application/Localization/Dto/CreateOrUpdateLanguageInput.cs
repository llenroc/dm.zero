using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;

namespace DM.AbpZeroTemplate.Localization.Dto
{
    public class CreateOrUpdateLanguageInput : IInputDto
    {
        [Required]
        public ApplicationLanguageEditDto Language { get; set; }
    }
}