using LionPark.Application.DTOs;
using LionPark.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LionPark.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehicleController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehicleController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] CreateVehicleDto dto)
    {
        var vehicle = await _vehicleService.AddAsync(dto);
        return CreatedAtAction(nameof(GetByUserId), new { userId = vehicle.UserId }, vehicle);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetByUserId(Guid userId)
    {
        var vehicles = await _vehicleService.GetByUserIdAsync(userId);
        return Ok(vehicles);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var vehicles = await _vehicleService.GetAllAsync();
        return Ok(vehicles);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Remove(Guid id)
    {
        await _vehicleService.RemoveAsync(id);
        return NoContent();
    }
}