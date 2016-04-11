using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.Auditing.Dto;
using DM.AbpZeroTemplate.Dto;

namespace DM.AbpZeroTemplate.Auditing
{
    public interface IAuditLogAppService : IApplicationService
    {
        Task<PagedResultOutput<AuditLogListDto>> GetAuditLogs(GetAuditLogsInput input);

        Task<FileDto> GetAuditLogsToExcel(GetAuditLogsInput input);
    }
}