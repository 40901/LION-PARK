using LionPark.Domain.Entities;

namespace LionPark.Domain.Interfaces;

public interface IParkingRecordRepository
{
    Task AddAsync(ParkingRecord record);
    Task<ParkingRecord?> GetByIdAsync(Guid id);
    Task<IEnumerable<ParkingRecord>> GetActiveRecordsAsync();
    Task<IEnumerable<ParkingRecord>> GetRecordsByDateRangeAsync(DateTime start, DateTime end);
    void Update(ParkingRecord record);
    Task SaveChangesAsync();
}