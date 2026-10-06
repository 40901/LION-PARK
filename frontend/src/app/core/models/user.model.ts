export interface UserResponseDto {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  role: string;
  planType: string;
  paymentDay: number;
  isActive: boolean;
}

export interface CreateUserDto {
  fullName: string;
  cpf: string;
  email: string;
  password?: string;
  role: string;
  planType?: string;
  paymentDay?: number;
}

export interface UpdateUserDto {
  fullName: string;
  cpf: string;
  email: string;
  planType: string;
  paymentDay: number;
}

export interface AuthResponse {
  token: string;
  user: UserResponseDto;
}