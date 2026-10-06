import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../config/environment';
import { CreatePriceRuleDto, PriceRuleResponseDto } from '../models/price-rule.model';

@Injectable({ providedIn: 'root' })
export class PriceRuleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pricerule`;

  create(dto: CreatePriceRuleDto) {
    return this.http.post<PriceRuleResponseDto>(this.apiUrl, dto);
  }

  getAll() {
    return this.http.get<PriceRuleResponseDto[]>(this.apiUrl);
  }

  remove(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}