namespace LionPark.Application.DTOs;

public class CreateSpotDto
{
    public string Identification { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

public class SpotResponseDto
{
    public Guid Id { get; set; }
    public string Identification { get; set; } = string.Empty;
    public bool IsOccupied { get; set; }
    public string Category { get; set; } = string.Empty;
}