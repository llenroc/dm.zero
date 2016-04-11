using System.Collections.Generic;
using DM.AbpZeroTemplate.Caching.Dto;

namespace DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Maintenance
{
    public class MaintenanceViewModel
    {
        public IReadOnlyList<CacheDto> Caches { get; set; }
    }
}