using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using DM.AbpZeroTemplate.Dto;

namespace DM.AbpZeroTemplate.CMS.Contents.Dto
{
    public class GetChannelGoodsInput : PagedAndSortedInputDto, IShouldNormalize
    {
        [Range(1, long.MaxValue)]
        public long Id { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "CreationTime";
            }
        }
    }
}