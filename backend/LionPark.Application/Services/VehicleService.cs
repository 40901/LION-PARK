using LionPark.Application.DTOs;
using LionPark.Application.Interfaces;
using LionPark.Domain.Entities;
using LionPark.Domain.Interfaces;

namespace LionPark.Application.Services;

public class VehicleService : IVehicleService
{
    private readonly IVehicleRepository _vehicleRepository;

    public VehicleService(IVehicleRepository vehicleRepository)
    {
        _vehicleRepository = vehicleRepository;
    }

    public async Task<VehicleResponseDto> AddAsync(CreateVehicleDto dto)
    {
        var vehicle = new Vehicle(dto.LicensePlate, dto.Model, dto.Color, dto.Category, dto.UserId);
        
        await _vehicleRepository.AddAsync(vehicle);
        await _vehicleRepository.SaveChangesAsync();

        return new VehicleResponseDto
        {
            Id = vehicle.Id,
            LicensePlate = vehicle.LicensePlate,
            Model = vehicle.Model,
            Color = vehicle.Color,
            Category = vehicle.Category,
            UserId = vehicle.UserId,
            OwnerName = string.Empty
        };
    }

    public async Task<IEnumerable<VehicleResponseDto>> GetByUserIdAsync(Guid userId)
    {
        var vehicles = await _vehicleRepository.GetByUserIdAsync(userId);
        return vehicles.Select(v => new VehicleResponseDto
        {
            Id = v.Id,
            LicensePlate = v.LicensePlate,
            Model = v.Model,
            Color = v.Color,
            Category = v.Category,
            UserId = v.UserId,
            OwnerName = string.Empty
        });
    }

    public async Task<IEnumerable<VehicleResponseDto>> GetAllAsync()
    {
        var vehicles = await _vehicleRepository.GetAllWithUserAsync();
        return vehicles.Select(v => new VehicleResponseDto
        {
            Id = v.Id,
            LicensePlate = v.LicensePlate,
            Model = v.Model,
            Color = v.Color,
            Category = v.Category,
            UserId = v.UserId,
            OwnerName = v.User?.FullName ?? "Desconhecido"
        });
    }

    public async Task RemoveAsync(Guid id)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle != null)
        {
            _vehicleRepository.Remove(vehicle);
            await _vehicleRepository.SaveChangesAsync();
        }
    }
}