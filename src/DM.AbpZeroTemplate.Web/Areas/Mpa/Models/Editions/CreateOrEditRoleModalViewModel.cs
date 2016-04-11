using Abp.AutoMapper;
using DM.AbpZeroTemplate.Editions.Dto;
using DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Common;

namespace DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Editions
{
    [AutoMapFrom(typeof(GetEditionForEditOutput))]
    public class CreateOrEditEditionModalViewModel : GetEditionForEditOutput, IFeatureEditViewModel
    {
        public bool IsEditMode
        {
            get { return Edition.Id.HasValue; }
        }

        public CreateOrEditEditionModalViewModel(GetEditionForEditOutput output)
        {
            output.MapTo(this);
        }
    }
}