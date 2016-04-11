using Abp.AutoMapper;
using Abp.Notifications;

namespace DM.AbpZeroTemplate.Notifications.Dto
{
    [AutoMapFrom(typeof(NotificationDefinition))]
    public class NotificationSubscriptionWithDisplayNameDto : NotificationSubscriptionDto
    {
        public string DisplayName { get; set; }

        public string Description { get; set; }
    }
}