using System.ComponentModel.DataAnnotations;
using Abp.Runtime.Validation;
using DM.AbpZeroTemplate.Dto;

namespace DM.AbpZeroTemplate.Organizations.Dto
{
    public class GetOrganizationUnitUsersInput : PagedAndSortedInputDto, IShouldNormalize
    {
        [Range(1, long.MaxValue)]
        public long Id { get; set; }

        public void Normalize()
        {
            if (string.IsNullOrEmpty(Sorting))
            {
                Sorting = "Name,Surname";
            }
        }
    }
}