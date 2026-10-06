import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../config/environment';
import { CreateVehicleDto, VehicleResponseDto } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vehicle`;

  add(dto: CreateVehicleDto) {
    return this.http.post<VehicleResponseDto>(this.apiUrl, dto);
  }

  getByUserId(userId: string) {
    return this.http.get<VehicleResponseDto[]>(`${this.apiUrl}/user/${userId}`);
  }

  getAll() {
    return this.http.get<VehicleResponseDto[]>(this.apiUrl);
  }

  remove(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}