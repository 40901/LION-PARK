namespace LionPark.Domain.Entities;

public class Vehicle
{
    public Guid Id { get; private set; }
    public string LicensePlate { get; private set; }
    public string Model { get; private set; }
    public string Color { get; private set; }
    public string Category { get; private set; }
    
    public Guid UserId { get; private set; }
    public User? User { get; private set; }

    public Vehicle(string licensePlate, string model, string color, string category, Guid userId)
    {
        Id = Guid.NewGuid();
        LicensePlate = licensePlate;
        Model = model;
        Color = color;
        Category = category;
        UserId = userId;
    }
}