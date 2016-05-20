using Abp.Apps;
using Abp.Channels;
using DM.AbpZeroTemplate.EntityFramework;
using DM.AbpZeroTemplate.MultiTenancy;
using System.Linq;

namespace DM.AbpZeroTemplate.Migrations.Seed
{
    public class DefaultAppChannelCreator
    {
        private readonly AbpZeroTemplateDbContext _context;

        public DefaultAppChannelCreator(AbpZeroTemplateDbContext context)
        {
            _context = context;
        }

        public void Create()
        {
            CreateAppAndChannel();
        }

        private void CreateAppAndChannel()
        {
            var defaultApp = _context.Apps.FirstOrDefault(e => e.Id > 0);
            if (defaultApp == null)
            {
                var defaultTenant = _context.Tenants.FirstOrDefault(t => t.TenancyName == Tenant.DefaultTenantName);
                defaultApp = new App
                {
                    AppName = App.DefaultName,
                    AppDir = App.DefaultDir,
                    AppUrl = "/" + App.DefaultDir,
                    TenantId = defaultTenant.Id
                };
                _context.Apps.Add(defaultApp);
                _context.SaveChanges();
            }


            var defaultChannel = _context.Channels.FirstOrDefault(e => e.Id > 0);
            if (defaultChannel == null)
            {
                defaultChannel = new Channel
                {
                    ParentId = null,
                    DisplayName = ChannelManager.DefaultChannelName,
                    AppId = defaultApp.Id,
                    Code = Channel.CreateCode(0),
                    Parent = null,
                    IsIndex = true
                };

                _context.Channels.Add(defaultChannel);
                _context.SaveChanges();
            }
        }
    }
}