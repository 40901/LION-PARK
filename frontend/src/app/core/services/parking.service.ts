import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../config/environment';
import { ParkingRecordResponseDto, RegisterEntryDto, RegisterExitDto } from '../models/parking.model';

@Injectable({ providedIn: 'root' })
export class ParkingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/parking`;

  registerEntry(dto: RegisterEntryDto) {
    return this.http.post<ParkingRecordResponseDto>(`${this.apiUrl}/entry`, dto);
  }

  registerExit(dto: RegisterExitDto) {
    return this.http.post<ParkingRecordResponseDto>(`${this.apiUrl}/exit`, dto);
  }

  getActiveRecords() {
    return this.http.get<ParkingRecordResponseDto[]>(`${this.apiUrl}/active`);
  }

  getReport(start: string, end: string) {
    return this.http.get<ParkingRecordResponseDto[]>(`${this.apiUrl}/report?start=${start}&end=${end}`);
  }
}