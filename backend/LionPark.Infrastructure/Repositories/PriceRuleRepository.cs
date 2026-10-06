using LionPark.Application.Interfaces;
using LionPark.Domain.Entities;
using LionPark.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LionPark.Infrastructure.Repositories;

public class PriceRuleRepository : IPriceRuleRepository
{
    private readonly LionParkDbContext _context;

    public PriceRuleRepository(LionParkDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(PriceRule priceRule)
    {
        await _context.PriceRules.AddAsync(priceRule);
    }

    public async Task<IEnumerable<PriceRule>> GetAllAsync()
    {
        return await _context.PriceRules.ToListAsync();
    }

    public async Task<PriceRule?> GetByIdAsync(Guid id)
    {
        return await _context.PriceRules.FindAsync(id);
    }

    public void Remove(PriceRule priceRule)
    {
        _context.PriceRules.Remove(priceRule);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}