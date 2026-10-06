using LionPark.Application.DTOs;

namespace LionPark.Application.Interfaces;

public interface IPriceRuleService
{
    Task<PriceRuleResponseDto> CreateAsync(CreatePriceRuleDto dto);
    Task<IEnumerable<PriceRuleResponseDto>> GetAllAsync();
    Task RemoveAsync(Guid id);
}