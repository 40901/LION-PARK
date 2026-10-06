using LionPark.Domain.Entities;

namespace LionPark.Domain.Interfaces;

public interface IUserRepository
{
    Task AddAsync(User user);
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllAsync();
    void Update(User user);
    Task SaveChangesAsync();
}