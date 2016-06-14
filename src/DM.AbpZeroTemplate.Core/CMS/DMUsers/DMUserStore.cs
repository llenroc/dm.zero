using Abp.Authorization.Users;
using Abp.DMUsers;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using DM.AbpZeroTemplate.Authorization.Roles;
using DM.AbpZeroTemplate.MultiTenancy;

namespace DM.AbpZeroTemplate.CMS.DMUsers
{
    /// <summary>
    /// User store.
    /// Used to perform database operations for <see cref="UserManager"/>.
    /// Extends <see cref="AbpUserStore{TTenant,TRole,TUser}"/>.
    /// </summary>
    public class DMUserStore : DMUserStore< DMUser>
    {
        public DMUserStore(
            IRepository<DMUser, long> userRepository,
            IRepository<Abp.DMUsers.DMUserLogin, long> userLoginRepository,
            IUnitOfWorkManager unitOfWorkManager
            )
            : base(
                userRepository,
                userLoginRepository,
                unitOfWorkManager
            )
        {
        }
    }
}