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

namespace DM.AbpZeroTemplate.Authorization.Users
{
    /// <summary>
    /// User manager.
    /// Used to implement domain logic for users.
    /// Extends <see cref="AbpUserManager{TTenant,TRole,TUser}"/>.
    /// </summary>
    public class UserManager : AbpUserManager<Tenant, Role, User>
    {
        private readonly AppManager _appManager;

        public UserManager(
            UserStore userStore,
            RoleManager roleManager,
            IRepository<Tenant> tenantRepository,
            IMultiTenancyConfig multiTenancyConfig,
            IPermissionManager permissionManager,
            IUnitOfWorkManager unitOfWorkManager,
            ISettingManager settingManager,
            IUserManagementConfig userManagementConfig,
            IIocResolver iocResolver,
            ICacheManager cacheManager,
            IRepository<OrganizationUnit, long> organizationUnitRepository,
            IRepository<UserOrganizationUnit, long> userOrganizationUnitRepository,
            IOrganizationUnitSettings organizationUnitSettings,
            IRepository<UserLoginAttempt, long> userLoginAttemptRepository,
            AppManager appManager)
            : base(
                userStore,
                roleManager,
                tenantRepository,
                multiTenancyConfig,
                permissionManager,
                unitOfWorkManager,
                settingManager,
                userManagementConfig,
                iocResolver,
                cacheManager,
                organizationUnitRepository,
                userOrganizationUnitRepository,
                organizationUnitSettings,
                userLoginAttemptRepository)
        {
            _appManager = appManager;
        }

        public override async Task<AbpLoginResult> LoginAsync(UserLoginInfo login, string tenancyName = null)
        {
            var result = await base.LoginAsync(login, tenancyName);

            //设置当前用户，最后查看的appId
            var defaultApp = await _appManager.FindDefaultAsync();
            if (defaultApp != null)
            {
                result.User.AppId = defaultApp.Id;
                await UpdateAsync(result.User);
            }
            return result;
        }
    }
}