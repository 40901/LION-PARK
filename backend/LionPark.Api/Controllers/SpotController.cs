using LionPark.Application.DTOs;
using LionPark.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LionPark.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SpotController : ControllerBase
{
    private readonly ISpotService _spotService;

    public SpotController(ISpotService spotService)
    {
        _spotService = spotService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSpotDto dto)
    {
        var spot = await _spotService.CreateAsync(dto);
        return Ok(spot);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var spots = await _spotService.GetAllAsync();
        return Ok(spots);
    }
}