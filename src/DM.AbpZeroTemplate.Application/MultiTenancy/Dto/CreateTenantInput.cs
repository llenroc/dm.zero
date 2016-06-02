using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using DM.AbpZeroTemplate.Authorization.Users;
using Abp.MultiTenancy;
using Abp.AutoMapper;

namespace DM.AbpZeroTemplate.MultiTenancy.Dto
{
    [AutoMapTo(typeof(Tenant))]
    public class CreateTenantInput : IInputDto
    {
        [Required]
        [StringLength(Tenant.MaxTenancyNameLength)]
        [RegularExpression(Tenant.TenancyNameRegex)]
        public string TenancyName { get; set; }

        [Required]
        [StringLength(Tenant.MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(User.MaxEmailAddressLength)]
        public string AdminEmailAddress { get; set; }

        [StringLength(User.MaxPasswordLength)]
        public string AdminPassword { get; set; }

        public bool ShouldChangePasswordOnNextLogin { get; set; }
        
        public bool SendActivationEmail { get; set; }

        public int? EditionId { get; set; }

        public bool IsActive { get; set; }

        [MaxLength(AbpTenantBase.MaxConnectionStringLength)]
        public string ConnectionString { get; set; }
    }
}