import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../config/environment';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/user`;

  create(dto: CreateUserDto) {
    return this.http.post<UserResponseDto>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateUserDto) {
    return this.http.put<UserResponseDto>(`${this.apiUrl}/${id}`, dto);
  }

  getById(id: string) {
    return this.http.get<UserResponseDto>(`${this.apiUrl}/${id}`);
  }

  getAll() {
    return this.http.get<UserResponseDto[]>(this.apiUrl);
  }

  deactivate(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}