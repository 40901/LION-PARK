export interface SubscriptionStatusResponseDto {
  userId: string;
  customerName: string;
  cpf: string;
  paymentDay: number;
  status: string;
  amountPaid?: number;
  paymentDate?: string;
}

export interface RegisterPaymentDto {
  userId: string;
  referenceMonth: number;
  referenceYear: number;
  amount: number;
}