namespace LionPark.Domain.Entities;

public class SubscriptionPayment
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public User? User { get; private set; }
    public int ReferenceMonth { get; private set; }
    public int ReferenceYear { get; private set; }
    public decimal Amount { get; private set; }
    public DateTime PaymentDate { get; private set; }

    public SubscriptionPayment(Guid userId, int referenceMonth, int referenceYear, decimal amount)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        ReferenceMonth = referenceMonth;
        ReferenceYear = referenceYear;
        Amount = amount;
        PaymentDate = DateTime.UtcNow;
    }
}