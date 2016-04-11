using System.Web.Mvc;
using Abp.Web.Mvc.Authorization;
using DM.AbpZeroTemplate.Web.Areas.Mpa.Models.Common.Modals;
using DM.AbpZeroTemplate.Web.Controllers;

namespace DM.AbpZeroTemplate.Web.Areas.Mpa.Controllers
{
    [AbpMvcAuthorize]
    public class CommonController : AbpZeroTemplateControllerBase
    {
        public PartialViewResult LookupModal(LookupModalViewModel model)
        {
            return PartialView("Modals/_LookupModal", model);
        }
    }
}