using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.Configuration;
using Abp.Configuration.Startup;
using Abp.Dependency;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Organizations;
using Abp.Runtime.Caching;
using Abp.Zero.Configuration;
using DM.AbpZeroTemplate.Authorization.Roles;
using DM.AbpZeroTemplate.MultiTenancy;
using Microsoft.AspNet.Identity;
using Abp.Apps;
using Abp.DMUsers;
using DM.AbpZeroTemplate.Authorization.Users;

namespace DM.AbpZeroTemplate.CMS.DMUsers
{
    /// <summary>
    /// DMUser manager.
    /// Used to implement domain logic for users.
    /// Extends <see cref="DMUserManager{TTenant,TUser}"/>.
    /// </summary>
    public class DMUserManager : DMUserManager<Tenant, User, DMUser>
    {
        private readonly AppManager _appManager;

        public DMUserManager(
            DMUserStore userStore,
            IRepository<Tenant> tenantRepository,
            IMultiTenancyConfig multiTenancyConfig,
            IUnitOfWorkManager unitOfWorkManager,
            ISettingManager settingManager,
            IIocResolver iocResolver,
            ICacheManager cacheManager,
            IRepository<Abp.DMUsers.DMUserLoginAttempt, long> userLoginAttemptRepository,
            AppManager appManager)
            : base(
                userStore,
                tenantRepository,
                multiTenancyConfig,
                unitOfWorkManager,
                settingManager,
                iocResolver,
                cacheManager,
                userLoginAttemptRepository)
        {
            _appManager = appManager;
        }

        public override async Task<DMLoginResult> LoginAsync(UserLoginInfo login, string tenancyName = null)
        {
            return await base.LoginAsync(login, tenancyName);
        }
    }
}