export interface PriceRuleResponseDto {
  id: string;
  name: string;
  type: string;
  price: number;
}

export interface CreatePriceRuleDto {
  name: string;
  type: string;
  price: number;
}