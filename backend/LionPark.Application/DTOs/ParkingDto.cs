namespace LionPark.Application.DTOs;

public class RegisterEntryDto
{
    public Guid VehicleId { get; set; }
    public Guid ParkingSpotId { get; set; }
}

public class RegisterExitDto
{
    public Guid ParkingRecordId { get; set; }
    public Guid PriceRuleId { get; set; }
}

public class ParkingRecordResponseDto
{
    public Guid Id { get; set; }
    public Guid VehicleId { get; set; }
    public string VehiclePlate { get; set; } = string.Empty;
    public Guid ParkingSpotId { get; set; }
    public string SpotIdentification { get; set; } = string.Empty;
    public DateTime EntryTime { get; set; }
    public DateTime? ExitTime { get; set; }
    public decimal? TotalAmount { get; set; }
}