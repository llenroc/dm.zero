using Abp.Application.Services.Dto;
using Abp.Apps;
using Abp.AutoMapper;
using DM.AbpZeroTemplate.MultiTenancy;

namespace DM.AbpZeroTemplate.Sessions.Dto
{
    [AutoMapFrom(typeof(App))]
    public class AppLoginInfoDto : EntityDto
    {
        public string AppName { get; set; }

        public string AppDir { get; set; }

        public string AppUrl { get; set; }

        public string DisplayName { get; set; }

        public string EditionDisplayName { get; set; }
    }
}