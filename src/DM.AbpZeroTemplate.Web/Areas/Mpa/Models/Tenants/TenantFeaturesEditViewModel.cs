using Abp.AutoMapper;
using DM.AbpZeroTemplate.MultiTenancy;
using DM.AbpZeroTemplate.MultiTenancy.Dto;
using DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Common;

namespace DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Tenants
{
    [AutoMapFrom(typeof (GetTenantFeaturesForEditOutput))]
    public class TenantFeaturesEditViewModel : GetTenantFeaturesForEditOutput, IFeatureEditViewModel
    {
        public Tenant Tenant { get; set; }

        public TenantFeaturesEditViewModel(Tenant tenant, GetTenantFeaturesForEditOutput output)
        {
            Tenant = tenant;
            output.MapTo(this);
        }
    }
}