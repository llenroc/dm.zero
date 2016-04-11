using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.Authorization.Users;

namespace DM.AbpZeroTemplate.Configuration.Host.Dto
{
    public class SendTestEmailInput : IInputDto
    {
        [Required]
        [MaxLength(User.MaxEmailAddressLength)]
        public string EmailAddress { get; set; }
    }
}