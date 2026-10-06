import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../config/environment';
import { RegisterPaymentDto, SubscriptionStatusResponseDto } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/subscription`;

  getStatus(month: number, year: number) {
    return this.http.get<SubscriptionStatusResponseDto[]>(`${this.apiUrl}/status?month=${month}&year=${year}`);
  }

  pay(dto: RegisterPaymentDto) {
    return this.http.post<void>(`${this.apiUrl}/pay`, dto);
  }
}