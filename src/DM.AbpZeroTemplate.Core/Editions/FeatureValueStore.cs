using Abp.Application.Features;
using DM.AbpZeroTemplate.Authorization.Roles;
using DM.AbpZeroTemplate.Authorization.Users;
using DM.AbpZeroTemplate.MultiTenancy;

namespace DM.AbpZeroTemplate.Editions
{
    public class FeatureValueStore : AbpFeatureValueStore<Tenant, Role, User>
    {
        public FeatureValueStore(TenantManager tenantManager) 
            : base(tenantManager)
        {
        }
    }
}
