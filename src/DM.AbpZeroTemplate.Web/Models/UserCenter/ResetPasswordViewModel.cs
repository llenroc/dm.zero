using System.ComponentModel.DataAnnotations;

namespace DM.AbpZeroTemplate.Web.Models.UserCenter
{
    public class ResetPasswordViewModel
    {
        /// <summary>
        /// Encrypted user id.
        /// </summary>
        [Required]
        public string UserId { get; set; }

        [Required]
        public string ResetCode { get; set; }
    }
}