import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { ToastService } from '../../core/services/toast.service';
import { UserResponseDto } from '../../core/models/user.model';
import { VehicleResponseDto } from '../../core/models/vehicle.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './customers.component.html'
})
export class CustomersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private vehicleService = inject(VehicleService);
  private toastService = inject(ToastService);

  customers = signal<UserResponseDto[]>([]);
  selectedCustomer = signal<UserResponseDto | null>(null);
  vehicles = signal<VehicleResponseDto[]>([]);
  
  isSubmittingCustomer = signal(false);
  isSubmittingVehicle = signal(false);
  isEditMode = signal(false);
  editingCustomerId = signal<string | null>(null);

  customerForm = this.fb.group({
    fullName: ['', Validators.required],
    cpf: ['', Validators.required],
    email: ['', [Validators.email]],
    planType: ['Padrão', Validators.required],
    paymentDay: [10]
  });

  vehicleForm = this.fb.group({
    licensePlate: ['', Validators.required],
    model: ['', Validators.required],
    color: ['', Validators.required],
    category: ['Carro', Validators.required]
  });

  ngOnInit() {
    this.loadCustomers();
    
    // Atualiza dinamicamente a validação do Dia de Pagamento
    this.customerForm.get('planType')?.valueChanges.subscribe(plan => {
      const paymentDayControl = this.customerForm.get('paymentDay');
      if (plan === 'Mensalista') {
        paymentDayControl?.setValidators([Validators.required]);
      } else {
        paymentDayControl?.clearValidators();
      }
      paymentDayControl?.updateValueAndValidity();
    });
  }

  loadCustomers() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.customers.set(data.filter(u => u.role === 'Customer'));
      },
      error: () => this.toastService.show('Erro ao carregar clientes', 'error')
    });
  }

  editCustomer(customer: UserResponseDto, event: Event) {
    event.stopPropagation();
    this.isEditMode.set(true);
    this.editingCustomerId.set(customer.id);
    this.customerForm.patchValue({
      fullName: customer.fullName,
      cpf: customer.cpf,
      email: customer.email,
      planType: customer.planType,
      paymentDay: customer.paymentDay || 10
    });
  }

  cancelEdit() {
    this.isEditMode.set(false);
    this.editingCustomerId.set(null);
    this.customerForm.reset({ planType: 'Padrão', paymentDay: 10 });
  }

  onSubmitCustomer() {
    if (this.customerForm.valid) {
      this.isSubmittingCustomer.set(true);
      
      if (this.isEditMode() && this.editingCustomerId()) {
        const payload = {
          fullName: this.customerForm.value.fullName,
          cpf: this.customerForm.value.cpf,
          email: this.customerForm.value.email || '',
          planType: this.customerForm.value.planType,
          paymentDay: this.customerForm.value.planType === 'Mensalista' ? Number(this.customerForm.value.paymentDay) : 10
        };

        this.userService.update(this.editingCustomerId()!, payload as any).subscribe({
          next: () => {
            this.toastService.show('Cliente atualizado com sucesso', 'success');
            this.cancelEdit();
            this.loadCustomers();
            this.isSubmittingCustomer.set(false);
          },
          error: () => this.isSubmittingCustomer.set(false)
        });
      } else {
        const payload = {
          fullName: this.customerForm.value.fullName,
          cpf: this.customerForm.value.cpf,
          email: this.customerForm.value.email || '',
          planType: this.customerForm.value.planType,
          paymentDay: this.customerForm.value.planType === 'Mensalista' ? Number(this.customerForm.value.paymentDay) : 10,
          password: 'cliente_padrao_123',
          role: 'Customer'
        };

        this.userService.create(payload as any).subscribe({
          next: () => {
            this.toastService.show('Cliente cadastrado com sucesso', 'success');
            this.customerForm.reset({ planType: 'Padrão', paymentDay: 10 });
            this.loadCustomers();
            this.isSubmittingCustomer.set(false);
          },
          error: () => this.isSubmittingCustomer.set(false)
        });
      }
    }
  }

  selectCustomer(customer: UserResponseDto) {
    this.selectedCustomer.set(customer);
    this.loadVehicles(customer.id);
  }

  loadVehicles(userId: string) {
    this.vehicleService.getByUserId(userId).subscribe({
      next: (data) => this.vehicles.set(data),
      error: () => this.toastService.show('Erro ao carregar veículos', 'error')
    });
  }

  onSubmitVehicle() {
    if (this.vehicleForm.valid && this.selectedCustomer()) {
      this.isSubmittingVehicle.set(true);
      const payload = {
        ...this.vehicleForm.value,
        userId: this.selectedCustomer()!.id
      };

      this.vehicleService.add(payload as any).subscribe({
        next: () => {
          this.toastService.show('Veículo cadastrado com sucesso', 'success');
          this.vehicleForm.reset({ category: 'Carro' });
          this.loadVehicles(this.selectedCustomer()!.id);
          this.isSubmittingVehicle.set(false);
        },
        error: () => this.isSubmittingVehicle.set(false)
      });
    }
  }

  removeVehicle(id: string) {
    this.vehicleService.remove(id).subscribe({
      next: () => {
        this.toastService.show('Veículo removido com sucesso', 'success');
        if (this.selectedCustomer()) {
          this.loadVehicles(this.selectedCustomer()!.id);
        }
      }
    });
  }
}