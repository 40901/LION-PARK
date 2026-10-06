namespace LionPark.Application.DTOs;

public class CreateUserDto
{
    public string FullName { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string PlanType { get; set; } = string.Empty;
    public int PaymentDay { get; set; } = 10;
}

public class UpdateUserDto
{
    public string FullName { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PlanType { get; set; } = string.Empty;
    public int PaymentDay { get; set; }
}

public class UserResponseDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string PlanType { get; set; } = string.Empty;
    public int PaymentDay { get; set; }
    public bool IsActive { get; set; }
}