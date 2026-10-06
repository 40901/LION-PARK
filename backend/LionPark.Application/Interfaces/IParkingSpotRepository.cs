using LionPark.Domain.Entities;

namespace LionPark.Application.Interfaces;

public interface IParkingSpotRepository
{
    Task AddAsync(ParkingSpot parkingSpot);
    Task<ParkingSpot?> GetByIdAsync(Guid id);
    Task<IEnumerable<ParkingSpot>> GetAllAsync();
    void Update(ParkingSpot parkingSpot);
    Task SaveChangesAsync();
}