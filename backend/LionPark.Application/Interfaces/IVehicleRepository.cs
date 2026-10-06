using LionPark.Domain.Entities;

namespace LionPark.Domain.Interfaces;

public interface IVehicleRepository
{
    Task AddAsync(Vehicle vehicle);
    Task<Vehicle?> GetByIdAsync(Guid id);
    Task<IEnumerable<Vehicle>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Vehicle>> GetAllWithUserAsync();
    void Remove(Vehicle vehicle);
    Task SaveChangesAsync();
}