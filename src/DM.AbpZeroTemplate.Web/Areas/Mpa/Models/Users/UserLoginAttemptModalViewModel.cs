using System.Collections.Generic;
using DM.AbpZeroTemplate.Authorization.Users.Dto;

namespace DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Users
{
    public class UserLoginAttemptModalViewModel
    {
        public List<UserLoginAttemptDto> LoginAttempts { get; set; }
    }
}