using System;
using Abp.Authorization.Users;
using Abp.Dependency;
using Abp.UI;
using Abp.DMUsers;

namespace DM.AbpZeroTemplate.CMS
{
    public class DMLoginResultTypeHelper : AbpZeroTemplateServiceBase, ITransientDependency
    {
        public Exception CreateExceptionForFailedLoginAttempt(DMLoginResultType result, string usernameOrEmailAddress, string tenancyName)
        {
            switch (result)
            {
                case DMLoginResultType.Success:
                    return new ApplicationException("Don't call this method with a success result!");
                case DMLoginResultType.InvalidUserNameOrEmailAddress:
                case DMLoginResultType.InvalidPassword:
                    return new UserFriendlyException(L("LoginFailed"), L("InvalidUserNameOrPassword"));
                case DMLoginResultType.InvalidTenancyName:
                    return new UserFriendlyException(L("LoginFailed"), L("ThereIsNoTenantDefinedWithName{0}", tenancyName));
                case DMLoginResultType.TenantIsNotActive:
                    return new UserFriendlyException(L("LoginFailed"), L("TenantIsNotActive", tenancyName));
                case DMLoginResultType.UserIsNotActive:
                    return new UserFriendlyException(L("LoginFailed"), L("UserIsNotActiveAndCanNotLogin", usernameOrEmailAddress));
                case DMLoginResultType.UserEmailIsNotConfirmed:
                    return new UserFriendlyException(L("LoginFailed"), L("UserEmailIsNotConfirmedAndCanNotLogin"));
                default: //Can not fall to default actually. But other result types can be added in the future and we may forget to handle it
                    Logger.Warn("Unhandled login fail reason: " + result);
                    return new UserFriendlyException(L("LoginFailed"));
            }
        }
    }
}
