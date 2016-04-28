using EntityFramework.DynamicFilters;
using DM.AbpZeroTemplate.EntityFramework;
using Abp.CMS.EntityFramework;
using Abp.Dependency;

namespace DM.AbpZeroTemplate.Migrations.Seed
{
    public class InitialDbBuilder
    {
        private readonly AbpZeroTemplateDbContext _context;

        public InitialDbBuilder(AbpZeroTemplateDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            _context.DisableAllFilters();

            new DefaultEditionCreator(_context).Create();
            new DefaultLanguagesCreator(_context).Create();
            new DefaultTenantRoleAndUserCreator(_context).Create();
            new DefaultSettingsCreator(_context).Create();

            #region CMS
            new DefaultAppChannelCreator(_context).Create();
            new DefaultTemplateCreator(_context).Create();
            #endregion

            _context.SaveChanges();
        }
    }
}
