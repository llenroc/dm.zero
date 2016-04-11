using Abp.AutoMapper;
using DM.AbpZeroTemplate.Authorization.Users;
using DM.AbpZeroTemplate.Authorization.Users.Dto;
using DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Common;

namespace DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Users
{
    [AutoMapFrom(typeof(GetUserPermissionsForEditOutput))]
    public class UserPermissionsEditViewModel : GetUserPermissionsForEditOutput, IPermissionsEditViewModel
    {
        public User User { get; private set; }

        public UserPermissionsEditViewModel(GetUserPermissionsForEditOutput output, User user)
        {
            User = user;
            output.MapTo(this);
        }
    }
}