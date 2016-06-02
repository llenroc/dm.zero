using Abp.Authorization.Roles;
using DM.AbpZeroTemplate.Authorization.Users;
using DM.AbpZeroTemplate.MultiTenancy;

namespace DM.AbpZeroTemplate.Authorization.Roles
{
    /// <summary>
    /// Represents a role in the system.
    /// </summary>
    public class Role : AbpRole<User>
    {
        public Role()
        {
            
        }

        public Role(int? tenantId, string displayName)
            : base(tenantId, displayName)
        {

        }

        public Role(int? tenantId, string name, string displayName)
            : base(tenantId, name, displayName)
        {

        }
    }
}
