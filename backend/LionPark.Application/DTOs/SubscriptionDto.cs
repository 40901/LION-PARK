namespace LionPark.Application.DTOs;

public class RegisterPaymentDto
{
    public Guid UserId { get; set; }
    public int ReferenceMonth { get; set; }
    public int ReferenceYear { get; set; }
    public decimal Amount { get; set; }
}

public class SubscriptionStatusResponseDto
{
    public Guid UserId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public int PaymentDay { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal? AmountPaid { get; set; }
    public DateTime? PaymentDate { get; set; }
}