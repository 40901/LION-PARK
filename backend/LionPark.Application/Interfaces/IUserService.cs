using LionPark.Application.DTOs;

namespace LionPark.Application.Interfaces;

public interface IUserService
{
    Task<UserResponseDto> CreateAsync(CreateUserDto dto);
    Task<UserResponseDto> UpdateAsync(Guid id, UpdateUserDto dto);
    Task<UserResponseDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<UserResponseDto>> GetAllAsync();
    Task DeactivateAsync(Guid id);
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
}