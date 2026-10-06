using LionPark.Application.DTOs;
using LionPark.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LionPark.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParkingController : ControllerBase
{
    private readonly IParkingService _parkingService;

    public ParkingController(IParkingService parkingService)
    {
        _parkingService = parkingService;
    }

    [HttpPost("entry")]
    public async Task<IActionResult> RegisterEntry([FromBody] RegisterEntryDto dto)
    {
        try
        {
            var record = await _parkingService.RegisterEntryAsync(dto);
            return Ok(record);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("exit")]
    public async Task<IActionResult> RegisterExit([FromBody] RegisterExitDto dto)
    {
        try
        {
            var record = await _parkingService.RegisterExitAsync(dto);
            return Ok(record);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveRecords()
    {
        var records = await _parkingService.GetActiveRecordsAsync();
        return Ok(records);
    }

    [HttpGet("report")]
    public async Task<IActionResult> GetReport([FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        var records = await _parkingService.GetReportAsync(start, end);
        return Ok(records);
    }
}