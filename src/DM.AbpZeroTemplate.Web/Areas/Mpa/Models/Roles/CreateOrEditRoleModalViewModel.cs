using Abp.AutoMapper;
using DM.AbpZeroTemplate.Authorization.Roles.Dto;
using DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Common;

namespace DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Roles
{
    [AutoMapFrom(typeof(GetRoleForEditOutput))]
    public class CreateOrEditRoleModalViewModel : GetRoleForEditOutput, IPermissionsEditViewModel
    {
        public bool IsEditMode
        {
            get { return Role.Id.HasValue; }
        }

        public CreateOrEditRoleModalViewModel(GetRoleForEditOutput output)
        {
            output.MapTo(this);
        }
    }
}