using System.Collections.Generic;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.Editions.Dto;

namespace DM.AbpZeroTemplate.MultiTenancy.Dto
{
    public class GetTenantFeaturesForEditOutput : IOutputDto
    {
        public List<NameValueDto> FeatureValues { get; set; }

        public List<FlatFeatureDto> Features { get; set; }
    }
}