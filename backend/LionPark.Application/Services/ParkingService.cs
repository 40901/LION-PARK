using LionPark.Application.DTOs;
using LionPark.Application.Interfaces;
using LionPark.Domain.Entities;
using LionPark.Domain.Interfaces;

namespace LionPark.Application.Services;

public class ParkingService : IParkingService
{
    private readonly IParkingRecordRepository _recordRepository;
    private readonly IParkingSpotRepository _spotRepository;
    private readonly IPriceRuleRepository _priceRuleRepository;

    public ParkingService(IParkingRecordRepository recordRepository, IParkingSpotRepository spotRepository, IPriceRuleRepository priceRuleRepository)
    {
        _recordRepository = recordRepository;
        _spotRepository = spotRepository;
        _priceRuleRepository = priceRuleRepository;
    }

    public async Task<ParkingRecordResponseDto> RegisterEntryAsync(RegisterEntryDto dto)
    {
        var spot = await _spotRepository.GetByIdAsync(dto.ParkingSpotId);
        if (spot == null || spot.IsOccupied) throw new Exception("Vaga indisponivel.");

        spot.Occupy();
        _spotRepository.Update(spot);

        var record = new ParkingRecord(dto.VehicleId, dto.ParkingSpotId);
        await _recordRepository.AddAsync(record);
        
        await _recordRepository.SaveChangesAsync();

        return new ParkingRecordResponseDto
        {
            Id = record.Id,
            VehicleId = record.VehicleId,
            VehiclePlate = string.Empty,
            ParkingSpotId = record.ParkingSpotId,
            SpotIdentification = spot.Identification,
            EntryTime = record.EntryTime,
            ExitTime = record.ExitTime,
            TotalAmount = record.TotalAmount
        };
    }

    public async Task<ParkingRecordResponseDto> RegisterExitAsync(RegisterExitDto dto)
    {
        var record = await _recordRepository.GetByIdAsync(dto.ParkingRecordId);
        if (record == null || record.ExitTime != null) throw new Exception("Registro invalido ou ja finalizado.");

        var priceRule = await _priceRuleRepository.GetByIdAsync(dto.PriceRuleId);
        if (priceRule == null) throw new Exception("Tabela de preco não encontrada.");

        var spot = record.ParkingSpot;
        if (spot != null)
        {
            spot.Vacate();
            _spotRepository.Update(spot);
        }

        record.RegisterExit(priceRule.Price);
        _recordRepository.Update(record);
        
        await _recordRepository.SaveChangesAsync();

        return new ParkingRecordResponseDto
        {
            Id = record.Id,
            VehicleId = record.VehicleId,
            VehiclePlate = record.Vehicle?.LicensePlate ?? string.Empty,
            ParkingSpotId = record.ParkingSpotId,
            SpotIdentification = record.ParkingSpot?.Identification ?? string.Empty,
            EntryTime = record.EntryTime,
            ExitTime = record.ExitTime,
            TotalAmount = record.TotalAmount
        };
    }

    public async Task<IEnumerable<ParkingRecordResponseDto>> GetActiveRecordsAsync()
    {
        var records = await _recordRepository.GetActiveRecordsAsync();
        return records.Select(r => new ParkingRecordResponseDto
        {
            Id = r.Id,
            VehicleId = r.VehicleId,
            VehiclePlate = r.Vehicle?.LicensePlate ?? "Deletado",
            ParkingSpotId = r.ParkingSpotId,
            SpotIdentification = r.ParkingSpot?.Identification ?? "Deletada",
            EntryTime = r.EntryTime,
            ExitTime = r.ExitTime,
            TotalAmount = r.TotalAmount
        });
    }

    public async Task<IEnumerable<ParkingRecordResponseDto>> GetReportAsync(DateTime start, DateTime end)
    {
        var records = await _recordRepository.GetRecordsByDateRangeAsync(start, end);
        return records.Select(r => new ParkingRecordResponseDto
        {
            Id = r.Id,
            VehicleId = r.VehicleId,
            VehiclePlate = r.Vehicle?.LicensePlate ?? "Deletado",
            ParkingSpotId = r.ParkingSpotId,
            SpotIdentification = r.ParkingSpot?.Identification ?? "Deletada",
            EntryTime = r.EntryTime,
            ExitTime = r.ExitTime,
            TotalAmount = r.TotalAmount
        });
    }
}