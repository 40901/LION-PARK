using LionPark.Application.DTOs;
using LionPark.Application.Interfaces;
using LionPark.Domain.Entities;
using LionPark.Domain.Interfaces;

namespace LionPark.Application.Services;

public class SubscriptionPaymentService : ISubscriptionPaymentService
{
    private readonly ISubscriptionPaymentRepository _paymentRepository;
    private readonly IUserRepository _userRepository;

    public SubscriptionPaymentService(ISubscriptionPaymentRepository paymentRepository, IUserRepository userRepository)
    {
        _paymentRepository = paymentRepository;
        _userRepository = userRepository;
    }

    public async Task RegisterPaymentAsync(RegisterPaymentDto dto)
    {
        var payment = new SubscriptionPayment(dto.UserId, dto.ReferenceMonth, dto.ReferenceYear, dto.Amount);
        await _paymentRepository.AddAsync(payment);
        await _paymentRepository.SaveChangesAsync();
    }

    public async Task<IEnumerable<SubscriptionStatusResponseDto>> GetStatusAsync(int month, int year)
    {
        var users = await _userRepository.GetAllAsync();
        var mensalistas = users.Where(u => u.PlanType == "Mensalista" && u.IsActive).ToList();
        
        var payments = await _paymentRepository.GetByMonthYearAsync(month, year);

        var currentDay = DateTime.UtcNow.Day;
        var currentMonth = DateTime.UtcNow.Month;
        var currentYear = DateTime.UtcNow.Year;

        var result = new List<SubscriptionStatusResponseDto>();

        foreach (var user in mensalistas)
        {
            var payment = payments.FirstOrDefault(p => p.UserId == user.Id);
            string status = "Pendente";

            if (payment != null)
            {
                status = "Pago";
            }
            else if (year < currentYear || (year == currentYear && month < currentMonth) || (year == currentYear && month == currentMonth && currentDay > user.PaymentDay))
            {
                status = "Atrasado";
            }

            result.Add(new SubscriptionStatusResponseDto
            {
                UserId = user.Id,
                CustomerName = user.FullName,
                Cpf = user.Cpf,
                PaymentDay = user.PaymentDay,
                Status = status,
                AmountPaid = payment?.Amount,
                PaymentDate = payment?.PaymentDate
            });
        }

        return result;
    }
}