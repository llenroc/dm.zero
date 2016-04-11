using System.Threading.Tasks;
using Abp.Application.Services;
using DM.AbpZeroTemplate.Configuration.Host.Dto;

namespace DM.AbpZeroTemplate.Configuration.Host
{
    public interface IHostSettingsAppService : IApplicationService
    {
        Task<HostSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(HostSettingsEditDto input);

        Task SendTestEmail(SendTestEmailInput input);
    }
}
