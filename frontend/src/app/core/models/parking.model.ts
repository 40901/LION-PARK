export interface ParkingRecordResponseDto {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  parkingSpotId: string;
  spotIdentification: string;
  entryTime: string;
  exitTime?: string;
  totalAmount?: number;
}

export interface RegisterEntryDto {
  vehicleId: string;
  parkingSpotId: string;
}

export interface RegisterExitDto {
  parkingRecordId: string;
  priceRuleId: string;
}