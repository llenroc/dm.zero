using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using DM.AbpZeroTemplate.Dto;

namespace DM.AbpZeroTemplate.CMS.Templates.Dto
{
    public class GetAppTemplateInput : PagedAndSortedInputDto, IShouldNormalize
    {
        [Range(1, long.MaxValue)]
        public long Id { get; set; }

        public string Type { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "CreationTime";
            }
        }
    }
}