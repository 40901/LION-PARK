namespace LionPark.Domain.Entities;

public class PriceRule
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Type { get; private set; }
    public decimal Price { get; private set; }

    public PriceRule(string name, string type, decimal price)
    {
        Id = Guid.NewGuid();
        Name = name;
        Type = type;
        Price = price;
    }
}