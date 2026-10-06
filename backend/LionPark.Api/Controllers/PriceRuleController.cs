using LionPark.Application.DTOs;
using LionPark.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LionPark.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PriceRuleController : ControllerBase
{
    private readonly IPriceRuleService _priceRuleService;

    public PriceRuleController(IPriceRuleService priceRuleService)
    {
        _priceRuleService = priceRuleService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePriceRuleDto dto)
    {
        var rule = await _priceRuleService.CreateAsync(dto);
        return Ok(rule);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var rules = await _priceRuleService.GetAllAsync();
        return Ok(rules);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Remove(Guid id)
    {
        await _priceRuleService.RemoveAsync(id);
        return NoContent();
    }
}