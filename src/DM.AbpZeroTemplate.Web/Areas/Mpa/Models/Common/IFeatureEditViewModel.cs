using System.Collections.Generic;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.Editions.Dto;

namespace DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Common
{
    public interface IFeatureEditViewModel
    {
        List<NameValueDto> FeatureValues { get; set; }

        List<FlatFeatureDto> Features { get; set; }
    }
}