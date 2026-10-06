using LionPark.Domain.Entities;
using LionPark.Domain.Interfaces;
using LionPark.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LionPark.Infrastructure.Repositories;

public class SubscriptionPaymentRepository : ISubscriptionPaymentRepository
{
    private readonly LionParkDbContext _context;

    public SubscriptionPaymentRepository(LionParkDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(SubscriptionPayment payment)
    {
        await _context.SubscriptionPayments.AddAsync(payment);
    }

    public async Task<IEnumerable<SubscriptionPayment>> GetByMonthYearAsync(int month, int year)
    {
        return await _context.SubscriptionPayments
            .Where(p => p.ReferenceMonth == month && p.ReferenceYear == year)
            .ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}