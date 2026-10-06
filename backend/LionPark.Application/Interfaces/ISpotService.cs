using LionPark.Application.DTOs;

namespace LionPark.Application.Interfaces;

public interface ISpotService
{
    Task<SpotResponseDto> CreateAsync(CreateSpotDto dto);
    Task<IEnumerable<SpotResponseDto>> GetAllAsync();
}