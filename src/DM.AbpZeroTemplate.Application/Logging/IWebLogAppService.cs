using Abp.Application.Services;
using DM.AbpZeroTemplate.Dto;
using DM.AbpZeroTemplate.Logging.Dto;

namespace DM.AbpZeroTemplate.Logging
{
    public interface IWebLogAppService : IApplicationService
    {
        GetLatestWebLogsOutput GetLatestWebLogs();

        FileDto DownloadWebLogs();
    }
}
