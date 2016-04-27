using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.IdentityFramework;
using Abp.MultiTenancy;
using Abp.Runtime.Session;
using Microsoft.AspNet.Identity;
using DM.AbpZeroTemplate.Authorization.Users;
using DM.AbpZeroTemplate.MultiTenancy;
using Abp.Apps;

namespace DM.AbpZeroTemplate
{
    /// <summary>
    /// All application services in this application is derived from this class.
    /// We can add common application service methods here.
    /// </summary>
    public abstract class AbpZeroTemplateAppServiceBase : ApplicationService
    {
        public TenantManager TenantManager { get; set; }

        public UserManager UserManager { get; set; }

        public AppManager AppManager { get; set; }

        public long AppId
        {
            get
            {
                var currentApp = GetCurrentApp();
                if (currentApp != null)
                    return currentApp.Id;
                else
                    return 0;
            }
        }

        public virtual async Task<long> GetAppIdAsync()
        {
            var currentApp = await GetCurrentAppAsync();
            if (currentApp != null)
                return currentApp.Id;
            else
                return 0;
        }

        protected AbpZeroTemplateAppServiceBase()
        {
            LocalizationSourceName = AbpZeroTemplateConsts.LocalizationSourceName;
        }

        protected virtual Task<User> GetCurrentUserAsync()
        {
            var user = UserManager.FindByIdAsync(AbpSession.GetUserId());
            if (user == null)
            {
                throw new ApplicationException("There is no current user!");
            }

            return user;
        }

        protected virtual User GetCurrentUser()
        {
            var user = UserManager.FindById(AbpSession.GetUserId());
            if (user == null)
            {
                throw new ApplicationException("There is no current user!");
            }

            return user;
        }

        protected virtual Task<Tenant> GetCurrentTenantAsync()
        {
            return TenantManager.GetByIdAsync(AbpSession.GetTenantId());
        }

        protected virtual Tenant GetCurrentTenant()
        {
            return TenantManager.GetById(AbpSession.GetTenantId());
        }


        protected virtual async Task<App> GetCurrentAppAsync()
        {
            var user = await GetCurrentUserAsync();

            if (user.AppId > 0)
                return await AppManager.GetByIdAsync(GetCurrentUser().AppId);
            else
            {
                return await AppManager.FindDefaultAsync();
            }
        }

        protected virtual App GetCurrentApp()
        {
            var user = GetCurrentUser();
            if (user.AppId > 0)
                return AppManager.GetById(GetCurrentUser().AppId);
            else
            {
                return AppManager.FindDefault();
            }
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}