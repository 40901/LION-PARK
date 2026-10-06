using LionPark.Domain.Entities;
using LionPark.Domain.Interfaces;
using LionPark.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LionPark.Infrastructure.Repositories;

public class ParkingRecordRepository : IParkingRecordRepository
{
    private readonly LionParkDbContext _context;

    public ParkingRecordRepository(LionParkDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(ParkingRecord record)
    {
        await _context.ParkingRecords.AddAsync(record);
    }

    public async Task<ParkingRecord?> GetByIdAsync(Guid id)
    {
        return await _context.ParkingRecords
            .Include(r => r.Vehicle)
            .Include(r => r.ParkingSpot)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<ParkingRecord>> GetActiveRecordsAsync()
    {
        return await _context.ParkingRecords
            .Include(r => r.Vehicle)
            .Include(r => r.ParkingSpot)
            .Where(r => r.ExitTime == null)
            .ToListAsync();
    }

    public async Task<IEnumerable<ParkingRecord>> GetRecordsByDateRangeAsync(DateTime start, DateTime end)
    {
        return await _context.ParkingRecords
            .Include(r => r.Vehicle)
            .Include(r => r.ParkingSpot)
            .Where(r => r.ExitTime != null && r.ExitTime >= start.ToUniversalTime() && r.ExitTime <= end.ToUniversalTime())
            .ToListAsync();
    }

    public void Update(ParkingRecord record)
    {
        _context.ParkingRecords.Update(record);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}