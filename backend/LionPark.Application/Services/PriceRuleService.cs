using LionPark.Application.DTOs;
using LionPark.Application.Interfaces;
using LionPark.Domain.Entities;
using LionPark.Domain.Interfaces;

namespace LionPark.Application.Services;

public class PriceRuleService : IPriceRuleService
{
    private readonly IPriceRuleRepository _priceRuleRepository;

    public PriceRuleService(IPriceRuleRepository priceRuleRepository)
    {
        _priceRuleRepository = priceRuleRepository;
    }

    public async Task<PriceRuleResponseDto> CreateAsync(CreatePriceRuleDto dto)
    {
        var priceRule = new PriceRule(dto.Name, dto.Type, dto.Price);
        
        await _priceRuleRepository.AddAsync(priceRule);
        await _priceRuleRepository.SaveChangesAsync();

        return new PriceRuleResponseDto
        {
            Id = priceRule.Id,
            Name = priceRule.Name,
            Type = priceRule.Type,
            Price = priceRule.Price
        };
    }

    public async Task<IEnumerable<PriceRuleResponseDto>> GetAllAsync()
    {
        var rules = await _priceRuleRepository.GetAllAsync();
        return rules.Select(r => new PriceRuleResponseDto
        {
            Id = r.Id,
            Name = r.Name,
            Type = r.Type,
            Price = r.Price
        });
    }

    public async Task RemoveAsync(Guid id)
    {
        var rule = await _priceRuleRepository.GetByIdAsync(id);
        if (rule != null)
        {
            _priceRuleRepository.Remove(rule);
            await _priceRuleRepository.SaveChangesAsync();
        }
    }
}