import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../config/environment';
import { CreateSpotDto, SpotResponseDto } from '../models/spot.model';

@Injectable({ providedIn: 'root' })
export class SpotService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/spot`;

  create(dto: CreateSpotDto) {
    return this.http.post<SpotResponseDto>(this.apiUrl, dto);
  }

  getAll() {
    return this.http.get<SpotResponseDto[]>(this.apiUrl);
  }
}