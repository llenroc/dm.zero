using DM.AbpZeroTemplate.Dto;

namespace DM.AbpZeroTemplate.Common.Dto
{
    public class FindUsersInput : PagedAndFilteredInputDto
    {
        public int? TenantId { get; set; }
    }
}