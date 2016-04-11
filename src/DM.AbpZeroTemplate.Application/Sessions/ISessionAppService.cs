using System.Threading.Tasks;
using Abp.Application.Services;
using DM.AbpZeroTemplate.Sessions.Dto;

namespace DM.AbpZeroTemplate.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
