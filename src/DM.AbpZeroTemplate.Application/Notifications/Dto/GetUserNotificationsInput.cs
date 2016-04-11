using Abp.Notifications;
using DM.AbpZeroTemplate.Dto;

namespace DM.AbpZeroTemplate.Notifications.Dto
{
    public class GetUserNotificationsInput : PagedInputDto
    {
        public UserNotificationState? State { get; set; }
    }
}