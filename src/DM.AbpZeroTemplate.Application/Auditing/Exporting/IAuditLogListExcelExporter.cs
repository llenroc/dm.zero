using System.Collections.Generic;
using DM.AbpZeroTemplate.Auditing.Dto;
using DM.AbpZeroTemplate.Dto;

namespace DM.AbpZeroTemplate.Auditing.Exporting
{
    public interface IAuditLogListExcelExporter
    {
        FileDto ExportToFile(List<AuditLogListDto> auditLogListDtos);
    }
}
