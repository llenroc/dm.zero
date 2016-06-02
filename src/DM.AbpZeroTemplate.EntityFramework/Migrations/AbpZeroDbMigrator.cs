using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.MultiTenancy;
using Abp.Zero.EntityFramework;
using DM.AbpZeroTemplate.EntityFramework;

namespace DM.AbpZeroTemplate.Migrations
{
    internal class AbpZeroDbMigrator : AbpZeroDbMigrator<AbpZeroTemplateDbContext, Configuration>
    {
        public AbpZeroDbMigrator(
            IUnitOfWorkManager unitOfWorkManager,
            IDbPerTenantConnectionStringResolver connectionStringResolver,
            IIocResolver iocResolver)
            : base(
                unitOfWorkManager,
                connectionStringResolver,
                iocResolver)
        {
        }
    }
}
