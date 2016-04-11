using Abp.Web.Mvc.Views;

namespace DM.AbpZeroTemplate.Web.Views
{
    public abstract class AbpZeroTemplateWebViewPageBase : AbpZeroTemplateWebViewPageBase<dynamic>
    {

    }

    public abstract class AbpZeroTemplateWebViewPageBase<TModel> : AbpWebViewPage<TModel>
    {
        protected AbpZeroTemplateWebViewPageBase()
        {
            LocalizationSourceName = AbpZeroTemplateConsts.LocalizationSourceName;
        }
    }
}