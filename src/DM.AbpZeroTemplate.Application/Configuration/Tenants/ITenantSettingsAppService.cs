using System.Threading.Tasks;
using Abp.Application.Services;
using DM.AbpZeroTemplate.Configuration.Tenants.Dto;

namespace DM.AbpZeroTemplate.Configuration.Tenants
{
    public interface ITenantSettingsAppService : IApplicationService
    {
        Task<TenantSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(TenantSettingsEditDto input);
    }
}
