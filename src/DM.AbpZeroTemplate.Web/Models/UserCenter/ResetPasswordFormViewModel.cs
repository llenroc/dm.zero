using System.ComponentModel.DataAnnotations;

namespace DM.AbpZeroTemplate.Web.Models.UserCenter
{
    public class ResetPasswordFormViewModel
    {
        /// <summary>
        /// Encrypted user id.
        /// </summary>
        [Required]
        public string UserId { get; set; }

        [Required]
        public string ResetCode { get; set; }
        
        [Required]
        public string Password { get; set; }
    }
}