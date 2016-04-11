using System.Web.Mvc;
using Abp.Auditing;
using Abp.Web.Mvc.Authorization;
using DM.AbpZeroTemplate.Authorization;
using DM.AbpZeroTemplate.Web.Controllers;

namespace DM.AbpZeroTemplate.Web.Areas.Mpa.Controllers
{
    [DisableAuditing]
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_AuditLogs)]
    public class AuditLogsController : AbpZeroTemplateControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}