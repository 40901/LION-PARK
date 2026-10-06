export interface VehicleResponseDto {
  id: string;
  licensePlate: string;
  model: string;
  color: string;
  category: string;
  userId: string;
  ownerName?: string;
}

export interface CreateVehicleDto {
  licensePlate: string;
  model: string;
  color: string;
  category: string;
  userId: string;
}