using LionPark.Application.DTOs;

namespace LionPark.Application.Interfaces;

public interface IParkingService
{
    Task<ParkingRecordResponseDto> RegisterEntryAsync(RegisterEntryDto dto);
    Task<ParkingRecordResponseDto> RegisterExitAsync(RegisterExitDto dto);
    Task<IEnumerable<ParkingRecordResponseDto>> GetActiveRecordsAsync();
    Task<IEnumerable<ParkingRecordResponseDto>> GetReportAsync(DateTime start, DateTime end);
}