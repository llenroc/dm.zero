using Abp.Application.Services.Dto;

namespace DM.AbpZeroTemplate.Sessions.Dto
{
    public class GetCurrentLoginInformationsOutput : IOutputDto
    {
        public UserLoginInfoDto User { get; set; }

        public TenantLoginInfoDto Tenant { get; set; }

        public AppLoginInfoDto App { get; set; }
    }
}