using Abp.Application.Services;
using DM.AbpZeroTemplate.Tenants.Dashboard.Dto;

namespace DM.AbpZeroTemplate.Tenants.Dashboard
{
    public interface ITenantDashboardAppService : IApplicationService
    {
        GetMemberActivityOutput GetMemberActivity();
    }
}
