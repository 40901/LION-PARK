import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../../core/services/vehicle.service';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { VehicleResponseDto } from '../../core/models/vehicle.model';
import { UserResponseDto } from '../../core/models/user.model';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vehicles.component.html'
})
export class VehiclesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  users = signal<UserResponseDto[]>([]);
  vehicles = signal<VehicleResponseDto[]>([]);
  isSubmitting = signal(false);
  selectedUserId = signal<string>('');

  vehicleForm = this.fb.group({
    userId: ['', Validators.required],
    licensePlate: ['', Validators.required],
    model: ['', Validators.required],
    color: ['', Validators.required],
    category: ['Carro', Validators.required]
  });

  ngOnInit() {
    this.userService.getAll().subscribe({
      next: (data) => this.users.set(data),
      error: () => this.toastService.show('Erro ao carregar lista de usuários', 'error')
    });
  }

  onUserSelect(event: Event) {
    const userId = (event.target as HTMLSelectElement).value;
    this.selectedUserId.set(userId);
    this.vehicleForm.patchValue({ userId });
    
    if (userId) {
      this.loadVehicles(userId);
    } else {
      this.vehicles.set([]);
    }
  }

  loadVehicles(userId: string) {
    this.vehicleService.getByUserId(userId).subscribe({
      next: (data) => this.vehicles.set(data),
      error: () => this.toastService.show('Erro ao carregar veículos do usuário', 'error')
    });
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      this.isSubmitting.set(true);
      this.vehicleService.add(this.vehicleForm.value as any).subscribe({
        next: () => {
          this.toastService.show('Veículo cadastrado com sucesso', 'success');
          const currentUserId = this.vehicleForm.value.userId;
          this.vehicleForm.reset({ userId: currentUserId, category: 'Carro' });
          if (currentUserId) this.loadVehicles(currentUserId);
          this.isSubmitting.set(false);
        },
        error: () => {
          this.isSubmitting.set(false);
        }
      });
    }
  }

  removeVehicle(id: string) {
    this.vehicleService.remove(id).subscribe({
      next: () => {
        this.toastService.show('Veículo removido com sucesso', 'success');
        if (this.selectedUserId()) {
          this.loadVehicles(this.selectedUserId());
        }
      }
    });
  }
}