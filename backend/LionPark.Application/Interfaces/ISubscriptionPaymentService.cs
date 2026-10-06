using LionPark.Application.DTOs;

namespace LionPark.Application.Interfaces;

public interface ISubscriptionPaymentService
{
    Task RegisterPaymentAsync(RegisterPaymentDto dto);
    Task<IEnumerable<SubscriptionStatusResponseDto>> GetStatusAsync(int month, int year);
}