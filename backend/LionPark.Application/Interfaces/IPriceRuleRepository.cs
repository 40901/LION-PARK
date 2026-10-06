using LionPark.Domain.Entities;

namespace LionPark.Application.Interfaces;

public interface IPriceRuleRepository
{
    Task AddAsync(PriceRule priceRule);
    Task<IEnumerable<PriceRule>> GetAllAsync();
    Task<PriceRule?> GetByIdAsync(Guid id);
    void Remove(PriceRule priceRule);
    Task SaveChangesAsync();
}