using Abp.Modules;
using Abp.MultiTenancy;
using Abp.Zero.Configuration;
using Castle.MicroKernel.Registration;
using NSubstitute;

namespace DM.AbpZeroTemplate.Tests
{
    [DependsOn(
        typeof(AbpZeroTemplateApplicationModule),
        typeof(AbpZeroTemplateDataModule))]
    public class AbpZeroTemplateTestModule : AbpModule
    {
        public override void PreInitialize()
        {
            //Use database as language management
            Configuration.Modules.Zero().LanguageManagement.EnableDbLocalization();

            IocManager.IocContainer.Register(
                Component.For<IAbpZeroDbMigrator>()
                .UsingFactoryMethod(() => Substitute.For<IAbpZeroDbMigrator>())
                .LifestyleSingleton()
            );
        }
    }
}
