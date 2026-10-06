using LionPark.Application.DTOs;
using LionPark.Application.Interfaces;
using LionPark.Domain.Entities;

namespace LionPark.Application.Services;

public class SpotService : ISpotService
{
    private readonly IParkingSpotRepository _spotRepository;

    public SpotService(IParkingSpotRepository spotRepository)
    {
        _spotRepository = spotRepository;
    }

    public async Task<SpotResponseDto> CreateAsync(CreateSpotDto dto)
    {
        var spot = new ParkingSpot(dto.Identification, dto.Category);
        
        await _spotRepository.AddAsync(spot);
        await _spotRepository.SaveChangesAsync();

        return new SpotResponseDto
        {
            Id = spot.Id,
            Identification = spot.Identification,
            Category = spot.Category,
            IsOccupied = spot.IsOccupied
        };
    }

    public async Task<IEnumerable<SpotResponseDto>> GetAllAsync()
    {
        var spots = await _spotRepository.GetAllAsync();
        return spots.Select(s => new SpotResponseDto
        {
            Id = s.Id,
            Identification = s.Identification,
            Category = s.Category,
            IsOccupied = s.IsOccupied
        });
    }
}