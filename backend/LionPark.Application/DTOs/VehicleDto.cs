namespace LionPark.Application.DTOs;

public class CreateVehicleDto
{
    public string LicensePlate { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public Guid UserId { get; set; }
}

public class VehicleResponseDto
{
    public Guid Id { get; set; }
    public string LicensePlate { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string OwnerName { get; set; } = string.Empty;
}