namespace LionPark.Domain.Entities;

public class ParkingRecord
{
    public Guid Id { get; private set; }
    public DateTime EntryTime { get; private set; }
    public DateTime? ExitTime { get; private set; }
    public decimal? TotalAmount { get; private set; }
    
    public Guid VehicleId { get; private set; }
    public Vehicle? Vehicle { get; private set; }

    public Guid ParkingSpotId { get; private set; }
    public ParkingSpot? ParkingSpot { get; private set; }

    public ParkingRecord(Guid vehicleId, Guid parkingSpotId)
    {
        Id = Guid.NewGuid();
        VehicleId = vehicleId;
        ParkingSpotId = parkingSpotId;
        EntryTime = DateTime.UtcNow;
    }

    public void RegisterExit(decimal finalAmount)
    {
        ExitTime = DateTime.UtcNow;
        TotalAmount = finalAmount;
    }
}