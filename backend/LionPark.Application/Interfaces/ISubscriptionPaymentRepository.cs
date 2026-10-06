using LionPark.Domain.Entities;

namespace LionPark.Domain.Interfaces;

public interface ISubscriptionPaymentRepository
{
    Task AddAsync(SubscriptionPayment payment);
    Task<IEnumerable<SubscriptionPayment>> GetByMonthYearAsync(int month, int year);
    Task SaveChangesAsync();
}