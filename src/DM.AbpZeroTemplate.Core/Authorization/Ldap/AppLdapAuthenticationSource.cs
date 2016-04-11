using Abp.Zero.Ldap.Authentication;
using Abp.Zero.Ldap.Configuration;
using DM.AbpZeroTemplate.Authorization.Users;
using DM.AbpZeroTemplate.MultiTenancy;

namespace DM.AbpZeroTemplate.Authorization.Ldap
{
    public class AppLdapAuthenticationSource : LdapAuthenticationSource<Tenant, User>
    {
        public AppLdapAuthenticationSource(ILdapSettings settings, IAbpZeroLdapModuleConfig ldapModuleConfig)
            : base(settings, ldapModuleConfig)
        {
        }
    }
}
