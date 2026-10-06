using LionPark.Application.Interfaces;
using LionPark.Domain.Entities;
using LionPark.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LionPark.Infrastructure.Repositories;

public class ParkingSpotRepository : IParkingSpotRepository
{
    private readonly LionParkDbContext _context;

    public ParkingSpotRepository(LionParkDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(ParkingSpot parkingSpot)
    {
        await _context.ParkingSpots.AddAsync(parkingSpot);
    }

    public async Task<ParkingSpot?> GetByIdAsync(Guid id)
    {
        return await _context.ParkingSpots.FindAsync(id);
    }

    public async Task<IEnumerable<ParkingSpot>> GetAllAsync()
    {
        return await _context.ParkingSpots.ToListAsync();
    }

    public void Update(ParkingSpot parkingSpot)
    {
        _context.ParkingSpots.Update(parkingSpot);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}