using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Abp.Auditing;
using Abp.Configuration;
using Abp.Configuration.Startup;
using Abp.Domain.Uow;
using Abp.Extensions;
using Abp.Notifications;
using Abp.Runtime.Caching;
using Abp.Threading;
using Abp.UI;
using Abp.Web.Mvc.Models;
using Abp.Zero.Configuration;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using DM.AbpZeroTemplate.Configuration;
using DM.AbpZeroTemplate.Debugging;
using DM.AbpZeroTemplate.MultiTenancy;
using DM.AbpZeroTemplate.Notifications;
using DM.AbpZeroTemplate.Web.MultiTenancy;
using Recaptcha.Web;
using Recaptcha.Web.Mvc;
using Abp.DMUsers;
using DM.AbpZeroTemplate.CMS.DMUsers;
using DM.AbpZeroTemplate.CMS;
using DM.AbpZeroTemplate.Web.Models.UserCenter;
using DM.AbpZeroTemplate.Authorization.Users;

namespace DM.AbpZeroTemplate.Web.Controllers
{
    public class UserCenterController : AbpZeroTemplateControllerBase
    {
        private readonly DMUserManager _userManager;
        private readonly TenantManager _tenantManager;
        private readonly IMultiTenancyConfig _multiTenancyConfig;
        private readonly IDMUserEmailer _userEmailer;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        private readonly ITenancyNameFinder _tenancyNameFinder;
        private readonly ICacheManager _cacheManager;
        private readonly IWebUrlService _webUrlService;
        private readonly IAppNotifier _appNotifier;
        private readonly DMLoginResultTypeHelper _abpLoginResultTypeHelper;
        private readonly INotificationSubscriptionManager _notificationSubscriptionManager;

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        public UserCenterController(
            DMUserManager userManager,
            IMultiTenancyConfig multiTenancyConfig,
            IDMUserEmailer userEmailer,
            TenantManager tenantManager,
            IUnitOfWorkManager unitOfWorkManager,
            ITenancyNameFinder tenancyNameFinder,
            ICacheManager cacheManager,
            IAppNotifier appNotifier,
            IWebUrlService webUrlService,
            DMLoginResultTypeHelper abpLoginResultTypeHelper,
            INotificationSubscriptionManager notificationSubscriptionManager)
        {
            _userManager = userManager;
            _multiTenancyConfig = multiTenancyConfig;
            _userEmailer = userEmailer;
            _tenantManager = tenantManager;
            _unitOfWorkManager = unitOfWorkManager;
            _tenancyNameFinder = tenancyNameFinder;
            _cacheManager = cacheManager;
            _webUrlService = webUrlService;
            _appNotifier = appNotifier;
            _abpLoginResultTypeHelper = abpLoginResultTypeHelper;
            _notificationSubscriptionManager = notificationSubscriptionManager;
        }

        #region Login / Logout

        public ActionResult Login(string userNameOrEmailAddress = "", string returnUrl = "", string successMessage = "")
        {
            if (string.IsNullOrWhiteSpace(returnUrl))
            {
                returnUrl = Url.Action("Index", "Application");
            }

            ViewBag.ReturnUrl = returnUrl;
            ViewBag.IsMultiTenancyEnabled = _multiTenancyConfig.IsEnabled;

            return View(
                new Models.UserCenter.LoginFormViewModel
                {
                    TenancyName = _tenancyNameFinder.GetCurrentTenancyNameOrNull(),
                    IsSelfRegistrationEnabled = IsSelfRegistrationEnabled(),
                    SuccessMessage = successMessage,
                    UserNameOrEmailAddress = userNameOrEmailAddress
                });
        }

        [HttpPost]
        [UnitOfWork]
        [DisableAuditing]
        public virtual async Task<JsonResult> Login(LoginViewModel loginModel, string returnUrl = "", string returnUrlHash = "")
        {
            CheckModelState();

            _unitOfWorkManager.Current.DisableFilter(AbpDataFilters.MayHaveTenant);

            var loginResult = await GetLoginResultAsync(loginModel.UsernameOrEmailAddress, loginModel.Password, loginModel.TenancyName);

            if (loginResult.User.ShouldChangePasswordOnNextLogin)
            {
                loginResult.User.SetNewPasswordResetCode();

                return Json(new MvcAjaxResponse
                {
                    TargetUrl = Url.Action(
                        "ResetPassword",
                        new ResetPasswordViewModel
                        {
                            UserId = Security.SimpleStringCipher.Encrypt(loginResult.User.Id.ToString()),
                            ResetCode = loginResult.User.PasswordResetCode
                        })
                });
            }

            await SignInAsync(loginResult.User, loginResult.Identity, loginModel.RememberMe);

            if (string.IsNullOrWhiteSpace(returnUrl))
            {
                returnUrl = Url.Action("Index", "Application");
            }

            if (!string.IsNullOrWhiteSpace(returnUrlHash))
            {
                returnUrl = returnUrl + returnUrlHash;
            }

            return Json(new MvcAjaxResponse { TargetUrl = returnUrl });
        }

        public ActionResult Logout()
        {
            AuthenticationManager.SignOut();
            return RedirectToAction("Login");
        }

        private async Task SignInAsync(DMUser user, ClaimsIdentity identity = null, bool rememberMe = false)
        {
            if (identity == null)
            {
                identity = await _userManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);
            }

            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);
            AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = rememberMe }, identity);
        }

        private async Task<DMUserManager<Tenant, User, DMUser>.DMLoginResult> GetLoginResultAsync(string usernameOrEmailAddress, string password, string tenancyName)
        {
            var loginResult = await _userManager.LoginAsync(usernameOrEmailAddress, password, tenancyName);

            switch (loginResult.Result)
            {
                case DMLoginResultType.Success:
                    return loginResult;
                default:
                    throw _abpLoginResultTypeHelper.CreateExceptionForFailedLoginAttempt(loginResult.Result, usernameOrEmailAddress, tenancyName);
            }
        }

        #endregion

        #region Register

        public ActionResult Register()
        {
            return RegisterView(new RegisterViewModel
            {
                TenancyName = _tenancyNameFinder.GetCurrentTenancyNameOrNull()
            });
        }

        public ActionResult RegisterView(RegisterViewModel model)
        {
            CheckSelfRegistrationIsEnabled();

            ViewBag.IsMultiTenancyEnabled = _multiTenancyConfig.IsEnabled;
            ViewBag.UseCaptcha = !model.IsExternalLogin && UseCaptchaOnRegistration();

            return View("Register", model);
        }

        [HttpPost]
        [UnitOfWork]
        [ValidateAntiForgeryToken]
        public virtual async Task<ActionResult> Register(RegisterViewModel model)
        {
            try
            {
                CheckSelfRegistrationIsEnabled();

                CheckModelState();

                if (!model.IsExternalLogin && UseCaptchaOnRegistration())
                {
                    var recaptchaHelper = this.GetRecaptchaVerificationHelper();
                    if (recaptchaHelper.Response.IsNullOrEmpty())
                    {
                        throw new UserFriendlyException(L("CaptchaCanNotBeEmpty"));
                    }

                    if (recaptchaHelper.VerifyRecaptchaResponse() != RecaptchaVerificationResult.Success)
                    {
                        throw new UserFriendlyException(L("IncorrectCaptchaAnswer"));
                    }
                }

                if (!_multiTenancyConfig.IsEnabled)
                {
                    model.TenancyName = Tenant.DefaultTenantName;
                }
                else if (model.TenancyName.IsNullOrEmpty())
                {
                    throw new UserFriendlyException(L("TenantNameCanNotBeEmpty"));
                }

                var tenant = await GetActiveTenantAsync(model.TenancyName);

                if (!await SettingManager.GetSettingValueForTenantAsync<bool>(AppSettings.UserManagement.AllowSelfRegistration, tenant.Id))
                {
                    throw new UserFriendlyException(L("SelfUserRegistrationIsDisabledMessage_Detail"));
                }

                //Getting tenant-specific settings
                var isNewRegisteredUserActiveByDefault = await SettingManager.GetSettingValueForTenantAsync<bool>(AppSettings.UserManagement.IsNewRegisteredUserActiveByDefault, tenant.Id);
                var isEmailConfirmationRequiredForLogin = await SettingManager.GetSettingValueForTenantAsync<bool>(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin, tenant.Id);

                var user = new DMUser
                {
                    TenantId = tenant.Id,
                    Name = model.Name,
                    Surname = model.Surname,
                    EmailAddress = model.EmailAddress,
                    IsActive = isNewRegisteredUserActiveByDefault
                };

                ExternalLoginInfo externalLoginInfo = null;
                if (model.IsExternalLogin)
                {
                    externalLoginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
                    if (externalLoginInfo == null)
                    {
                        throw new ApplicationException("Can not external login!");
                    }

                    user.Logins = new List<DMUserLogin>
                    {
                        new DMUserLogin
                        {
                            LoginProvider = externalLoginInfo.Login.LoginProvider,
                            ProviderKey = externalLoginInfo.Login.ProviderKey
                        }
                    };

                    model.UserName = model.EmailAddress;
                    model.Password = DMUser.CreateRandomPassword();

                    if (string.Equals(externalLoginInfo.Email, model.EmailAddress, StringComparison.InvariantCultureIgnoreCase))
                    {
                        user.IsEmailConfirmed = true;
                    }
                }
                else
                {
                    if (model.UserName.IsNullOrEmpty() || model.Password.IsNullOrEmpty())
                    {
                        throw new UserFriendlyException(L("FormIsNotValidMessage"));
                    }
                }

                user.UserName = model.UserName;
                user.Password = new PasswordHasher().HashPassword(model.Password);

                _unitOfWorkManager.Current.EnableFilter(AbpDataFilters.MayHaveTenant);
                _unitOfWorkManager.Current.SetFilterParameter(AbpDataFilters.MayHaveTenant, AbpDataFilters.Parameters.TenantId, tenant.Id);

                CheckErrors(await _userManager.CreateAsync(user));
                await _unitOfWorkManager.Current.SaveChangesAsync();

                if (!user.IsEmailConfirmed)
                {
                    user.SetNewEmailConfirmationCode();
                    await _userEmailer.SendEmailActivationLinkAsync(user);
                }

                //Directly login if possible
                if (user.IsActive && (user.IsEmailConfirmed || !isEmailConfirmationRequiredForLogin))
                {
                    DMUserManager<Tenant, User, DMUser>.DMLoginResult loginResult;
                    if (externalLoginInfo != null)
                    {
                        loginResult = await _userManager.LoginAsync(externalLoginInfo.Login, tenant.TenancyName);
                    }
                    else
                    {
                        loginResult = await GetLoginResultAsync(user.UserName, model.Password, tenant.TenancyName);
                    }

                    if (loginResult.Result == DMLoginResultType.Success)
                    {
                        await SignInAsync(loginResult.User, loginResult.Identity);
                        return Redirect(Url.Action("Index", "Application"));
                    }

                    Logger.Warn("New registered user could not be login. This should not be normally. login result: " + loginResult.Result);
                }

                return View("RegisterResult", new RegisterResultViewModel
                {
                    TenancyName = tenant.TenancyName,
                    NameAndSurname = user.Name + " " + user.Surname,
                    UserName = user.UserName,
                    EmailAddress = user.EmailAddress,
                    IsActive = user.IsActive,
                    IsEmailConfirmationRequired = isEmailConfirmationRequiredForLogin
                });
            }
            catch (UserFriendlyException ex)
            {
                ViewBag.IsMultiTenancyEnabled = _multiTenancyConfig.IsEnabled;
                ViewBag.UseCaptcha = !model.IsExternalLogin && UseCaptchaOnRegistration();
                ViewBag.ErrorMessage = ex.Message;

                return View("Register", model);
            }
        }

        private bool UseCaptchaOnRegistration()
        {
            if (DebugHelper.IsDebug)
            {
                return false;
            }

            var tenancyName = _tenancyNameFinder.GetCurrentTenancyNameOrNull();
            if (tenancyName.IsNullOrEmpty())
            {
                return true;
            }

            var tenant = AsyncHelper.RunSync(() => GetActiveTenantAsync(tenancyName));
            return SettingManager.GetSettingValueForTenant<bool>(AppSettings.UserManagement.UseCaptchaOnRegistration, tenant.Id);
        }

        private void CheckSelfRegistrationIsEnabled()
        {
            if (!IsSelfRegistrationEnabled())
            {
                throw new UserFriendlyException(L("SelfUserRegistrationIsDisabledMessage_Detail"));
            }
        }

        private bool IsSelfRegistrationEnabled()
        {
            var tenancyName = _tenancyNameFinder.GetCurrentTenancyNameOrNull();
            if (tenancyName.IsNullOrEmpty())
            {
                return true;
            }

            var tenant = AsyncHelper.RunSync(() => GetActiveTenantAsync(tenancyName));
            return SettingManager.GetSettingValueForTenant<bool>(AppSettings.UserManagement.AllowSelfRegistration, tenant.Id);
        }

        #endregion

        #region ForgotPassword / ResetPassword

        public ActionResult ForgotPassword()
        {
            ViewBag.IsMultiTenancyEnabled = _multiTenancyConfig.IsEnabled;
            ViewBag.TenancyName = _tenancyNameFinder.GetCurrentTenancyNameOrNull();

            return View();
        }

        [HttpPost]
        [UnitOfWork]
        [ValidateAntiForgeryToken]
        public virtual async Task<JsonResult> SendPasswordResetLink(SendPasswordResetLinkViewModel model)
        {
            CheckModelState();

            _unitOfWorkManager.Current.DisableFilter(AbpDataFilters.MayHaveTenant);

            var user = await GetUserByChecking(model.EmailAddress, model.TenancyName);
            user.SetNewPasswordResetCode();
            await _userEmailer.SendPasswordResetLinkAsync(user);

            return Json(new MvcAjaxResponse());
        }

        [UnitOfWork]
        public virtual async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            CheckModelState();

            _unitOfWorkManager.Current.DisableFilter(AbpDataFilters.MayHaveTenant);

            var userId = Convert.ToInt64(Security.SimpleStringCipher.Decrypt(model.UserId));

            var user = await _userManager.GetDMUserByIdAsync(userId);
            if (user == null || user.PasswordResetCode.IsNullOrEmpty() || user.PasswordResetCode != model.ResetCode)
            {
                throw new UserFriendlyException(L("InvalidPasswordResetCode"), L("InvalidPasswordResetCode_Detail"));
            }

            return View(model);
        }

        [HttpPost]
        [UnitOfWork]
        public virtual async Task<ActionResult> ResetPassword(ResetPasswordFormViewModel model)
        {
            CheckModelState();

            _unitOfWorkManager.Current.DisableFilter(AbpDataFilters.MayHaveTenant);

            var userId = Convert.ToInt64(Security.SimpleStringCipher.Decrypt(model.UserId));

            var user = await _userManager.GetDMUserByIdAsync(userId);
            if (user == null || user.PasswordResetCode.IsNullOrEmpty() || user.PasswordResetCode != model.ResetCode)
            {
                throw new UserFriendlyException(L("InvalidPasswordResetCode"), L("InvalidPasswordResetCode_Detail"));
            }

            user.Password = new PasswordHasher().HashPassword(model.Password);
            user.PasswordResetCode = null;
            user.IsEmailConfirmed = true;
            user.ShouldChangePasswordOnNextLogin = false;

            await _userManager.UpdateAsync(user);

            if (user.IsActive)
            {
                await SignInAsync(user);
            }

            return RedirectToAction("Index", "Application");
        }

        #endregion

        #region Email activation / confirmation

        public ActionResult EmailActivation()
        {
            ViewBag.IsMultiTenancyEnabled = _multiTenancyConfig.IsEnabled;
            ViewBag.TenancyName = _tenancyNameFinder.GetCurrentTenancyNameOrNull();

            return View();
        }

        [HttpPost]
        [UnitOfWork]
        [ValidateAntiForgeryToken]
        public virtual async Task<JsonResult> SendEmailActivationLink(SendEmailActivationLinkViewModel model)
        {
            _unitOfWorkManager.Current.DisableFilter(AbpDataFilters.MayHaveTenant);

            var user = await GetUserByChecking(model.EmailAddress, model.TenancyName);

            user.SetNewEmailConfirmationCode();
            await _userEmailer.SendEmailActivationLinkAsync(user);

            return Json(new MvcAjaxResponse());
        }

        [UnitOfWork]
        public virtual async Task<ActionResult> EmailConfirmation(EmailConfirmationViewModel model)
        {
            CheckModelState();

            _unitOfWorkManager.Current.DisableFilter(AbpDataFilters.MayHaveTenant);

            var userId = Convert.ToInt64(Security.SimpleStringCipher.Decrypt(model.UserId));

            var user = await _userManager.GetDMUserByIdAsync(userId);
            if (user == null || user.EmailConfirmationCode.IsNullOrEmpty() || user.EmailConfirmationCode != model.ConfirmationCode)
            {
                throw new UserFriendlyException(L("InvalidEmailConfirmationCode"), L("InvalidEmailConfirmationCode_Detail"));
            }

            user.IsEmailConfirmed = true;
            user.EmailConfirmationCode = null;

            await _userManager.UpdateAsync(user);

            var tenancyName = user.TenantId.HasValue
                ? (await _tenantManager.GetByIdAsync(user.TenantId.Value)).TenancyName
                : "";

            return RedirectToAction(
                "Login",
                new
                {
                    successMessage = L("YourEmailIsConfirmedMessage"),
                    tenancyName = tenancyName,
                    userNameOrEmailAddress = user.UserName
                });
        }

        #endregion

        #region Child actions

        [ChildActionOnly]
        public PartialViewResult Languages()
        {
            return PartialView("~/Views/UserCenter/_Languages.cshtml",
                new LanguagesViewModel
                {
                    AllLanguages = LocalizationManager.GetAllLanguages(),
                    CurrentLanguage = LocalizationManager.CurrentLanguage
                });
        }

        #endregion

        #region Private methods

        private async Task<DMUser> GetUserByChecking(string emailAddress, string tenancyName)
        {
            var tenantId = await GetTenantIdOrDefault(tenancyName);
            var user = await _userManager.Users.Where(
                u => u.EmailAddress == emailAddress && u.TenantId == tenantId
                ).FirstOrDefaultAsync();

            if (user == null)
            {
                throw new UserFriendlyException(L("InvalidEmailAddress"));
            }

            return user;
        }

        private async Task<int?> GetTenantIdOrDefault(string tenancyName)
        {
            return tenancyName.IsNullOrEmpty()
                ? AbpSession.TenantId
                : (await GetActiveTenantAsync(tenancyName)).Id;
        }

        private async Task<Tenant> GetActiveTenantAsync(string tenancyName)
        {
            var tenant = await _tenantManager.FindByTenancyNameAsync(tenancyName);
            if (tenant == null)
            {
                throw new UserFriendlyException(L("ThereIsNoTenantDefinedWithName{0}", tenancyName));
            }

            if (!tenant.IsActive)
            {
                throw new UserFriendlyException(L("TenantIsNotActive", tenancyName));
            }

            return tenant;
        }

        #endregion
    }
}