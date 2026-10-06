namespace LionPark.Domain.Entities;

public class ParkingSpot
{
    public Guid Id { get; private set; }
    public string Identification { get; private set; } 
    public bool IsOccupied { get; private set; }
    public string Category { get; private set; } 

    public ParkingSpot(string identification, string category)
    {
        Id = Guid.NewGuid();
        Identification = identification;
        Category = category;
        IsOccupied = false;
    }

    public void Occupy() => IsOccupied = true;
    public void Vacate() => IsOccupied = false;
}