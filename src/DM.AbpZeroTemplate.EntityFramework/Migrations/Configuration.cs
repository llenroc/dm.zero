using System.Data.Entity.Migrations;
using DM.AbpZeroTemplate.Migrations.Seed;
using Abp.Zero.EntityFramework;
using Abp.MultiTenancy;

namespace DM.AbpZeroTemplate.Migrations
{
    internal sealed class Configuration : DbMigrationsConfiguration<EntityFramework.AbpZeroTemplateDbContext>, IMultiTenantSeed
    {
        public AbpTenantBase Tenant { get; set; }

        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "AbpZeroTemplate";
        }

        protected override void Seed(EntityFramework.AbpZeroTemplateDbContext context)
        {
            new InitialDbBuilder(context).Create();
        }
    }
}
