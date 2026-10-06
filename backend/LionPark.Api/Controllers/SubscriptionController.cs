using LionPark.Application.DTOs;
using LionPark.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LionPark.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubscriptionController : ControllerBase
{
    private readonly ISubscriptionPaymentService _subscriptionService;

    public SubscriptionController(ISubscriptionPaymentService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    [HttpPost("pay")]
    public async Task<IActionResult> RegisterPayment([FromBody] RegisterPaymentDto dto)
    {
        await _subscriptionService.RegisterPaymentAsync(dto);
        return Ok();
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetStatus([FromQuery] int month, [FromQuery] int year)
    {
        var status = await _subscriptionService.GetStatusAsync(month, year);
        return Ok(status);
    }
}