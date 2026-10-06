export interface SpotResponseDto {
  id: string;
  identification: string;
  isOccupied: boolean;
  category: string;
}

export interface CreateSpotDto {
  identification: string;
  category: string;
}