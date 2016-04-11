using Abp.AutoMapper;
using DM.AbpZeroTemplate.Authorization.Users;
using DM.AbpZeroTemplate.Authorization.Users.Profile.Dto;

namespace DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Profile
{
    [AutoMapFrom(typeof (CurrentUserProfileEditDto))]
    public class MySettingsViewModel : CurrentUserProfileEditDto
    {
        public bool CanChangeUserName
        {
            get { return UserName != User.AdminUserName; }
        }

        public MySettingsViewModel(CurrentUserProfileEditDto currentUserProfileEditDto)
        {
            currentUserProfileEditDto.MapTo(this);
        }
    }
}