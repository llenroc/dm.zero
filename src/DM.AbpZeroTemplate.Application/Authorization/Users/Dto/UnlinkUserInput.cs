using Abp.Application.Services.Dto;

namespace DM.AbpZeroTemplate.Authorization.Users.Dto
{
    public class UnlinkUserInput : IInputDto
    {
        public long UserId { get; set; }
    }
}