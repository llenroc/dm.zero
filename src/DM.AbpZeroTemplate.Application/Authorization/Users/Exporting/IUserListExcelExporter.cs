using System.Collections.Generic;
using DM.AbpZeroTemplate.Authorization.Users.Dto;
using DM.AbpZeroTemplate.Dto;

namespace DM.AbpZeroTemplate.Authorization.Users.Exporting
{
    public interface IUserListExcelExporter
    {
        FileDto ExportToFile(List<UserListDto> userListDtos);
    }
}