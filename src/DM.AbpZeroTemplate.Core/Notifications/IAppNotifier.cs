using System.Threading.Tasks;
using Abp.Notifications;
using DM.AbpZeroTemplate.Authorization.Users;
using DM.AbpZeroTemplate.MultiTenancy;

namespace DM.AbpZeroTemplate.Notifications
{
    public interface IAppNotifier
    {
        Task WelcomeToTheApplicationAsync(User user);

        Task NewUserRegisteredAsync(User user);

        Task NewTenantRegisteredAsync(Tenant tenant);

        Task SendMessageAsync(int? tenantId, long userId, string message, NotificationSeverity severity = NotificationSeverity.Info);
    }
}
