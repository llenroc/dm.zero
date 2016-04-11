using System.Web.Mvc;

namespace DM.AbpZeroTemplate.Web.Controllers
{
    public class AboutController : AbpZeroTemplateControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
	}
}