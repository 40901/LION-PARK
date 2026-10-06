using LionPark.Application.DTOs;

namespace LionPark.Application.Interfaces;

public interface IVehicleService
{
    Task<VehicleResponseDto> AddAsync(CreateVehicleDto dto);
    Task<IEnumerable<VehicleResponseDto>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<VehicleResponseDto>> GetAllAsync();
    Task RemoveAsync(Guid id);
}