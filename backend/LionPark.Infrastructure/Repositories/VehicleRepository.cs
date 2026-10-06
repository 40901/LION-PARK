using LionPark.Domain.Entities;
using LionPark.Domain.Interfaces;
using LionPark.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LionPark.Infrastructure.Repositories;

public class VehicleRepository : IVehicleRepository
{
    private readonly LionParkDbContext _context;

    public VehicleRepository(LionParkDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Vehicle vehicle)
    {
        await _context.Vehicles.AddAsync(vehicle);
    }

    public async Task<Vehicle?> GetByIdAsync(Guid id)
    {
        return await _context.Vehicles.FindAsync(id);
    }

    public async Task<IEnumerable<Vehicle>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Vehicles.Where(v => v.UserId == userId).ToListAsync();
    }

    public async Task<IEnumerable<Vehicle>> GetAllWithUserAsync()
    {
        return await _context.Vehicles.Include(v => v.User).ToListAsync();
    }

    public void Remove(Vehicle vehicle)
    {
        _context.Vehicles.Remove(vehicle);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}