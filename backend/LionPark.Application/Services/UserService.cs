using LionPark.Application.DTOs;
using LionPark.Application.Interfaces;
using LionPark.Domain.Entities;
using LionPark.Domain.Interfaces;

namespace LionPark.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<UserResponseDto> CreateAsync(CreateUserDto dto)
    {
        var existingUsers = await _userRepository.GetAllAsync();
        var assignedRole = existingUsers.Any() ? (string.IsNullOrEmpty(dto.Role) ? "Operator" : dto.Role) : "Admin";
        var planType = string.IsNullOrEmpty(dto.PlanType) ? "Padrão" : dto.PlanType;

        var hash = _passwordHasher.Hash(dto.Password);
        var user = new User(dto.FullName, dto.Cpf, dto.Email, hash, assignedRole, planType, dto.PaymentDay);
        
        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return new UserResponseDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Cpf = user.Cpf,
            Email = user.Email,
            Role = user.Role,
            PlanType = user.PlanType,
            PaymentDay = user.PaymentDay,
            IsActive = user.IsActive
        };
    }

    public async Task<UserResponseDto> UpdateAsync(Guid id, UpdateUserDto dto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) throw new Exception("Usuário não encontrado.");

        user.UpdateCustomerInfo(dto.FullName, dto.Cpf, dto.Email, dto.PlanType, dto.PaymentDay);
        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return new UserResponseDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Cpf = user.Cpf,
            Email = user.Email,
            Role = user.Role,
            PlanType = user.PlanType,
            PaymentDay = user.PaymentDay,
            IsActive = user.IsActive
        };
    }

    public async Task<UserResponseDto?> GetByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return null;

        return new UserResponseDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Cpf = user.Cpf,
            Email = user.Email,
            Role = user.Role,
            PlanType = user.PlanType,
            PaymentDay = user.PaymentDay,
            IsActive = user.IsActive
        };
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(user => new UserResponseDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Cpf = user.Cpf,
            Email = user.Email,
            Role = user.Role,
            PlanType = user.PlanType,
            PaymentDay = user.PaymentDay,
            IsActive = user.IsActive
        });
    }

    public async Task DeactivateAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user != null)
        {
            user.AnonymizeData();
            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
        }
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null || !user.IsActive) return null;

        if (!_passwordHasher.Verify(dto.Password, user.PasswordHash)) return null;

        var token = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{user.Id}:{DateTime.UtcNow}"));

        return new AuthResponseDto
        {
            Token = token,
            User = new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Cpf = user.Cpf,
                Email = user.Email,
                Role = user.Role,
                PlanType = user.PlanType,
                PaymentDay = user.PaymentDay,
                IsActive = user.IsActive
            }
        };
    }
}