using System.Collections.Generic;
using DM.AbpZeroTemplate.Authorization.Dto;

namespace DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Common
{
    public interface IPermissionsEditViewModel
    {
        List<FlatPermissionDto> Permissions { get; set; }

        List<string> GrantedPermissionNames { get; set; }
    }
}