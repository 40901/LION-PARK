using LionPark.Domain.Entities;
using LionPark.Domain.Interfaces;
using LionPark.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LionPark.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly LionParkDbContext _context;

    public UserRepository(LionParkDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users.Include(u => u.Vehicles).FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public void Update(User user)
    {
        _context.Users.Update(user);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}