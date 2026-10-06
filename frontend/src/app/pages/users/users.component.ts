import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { UserResponseDto } from '../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  userService = inject(UserService);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);

  users = signal<UserResponseDto[]>([]);
  isSubmitting = signal(false);

  userForm = this.fb.group({
    fullName: ['', Validators.required],
    cpf: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => this.users.set(data.filter(u => u.role !== 'Customer')),
      error: () => this.toastService.show('Erro ao carregar usuários da API', 'error')
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting.set(true);

      const payload = {
        fullName: this.userForm.value.fullName,
        cpf: this.userForm.value.cpf,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        role: 'Operator'
      };

      this.userService.create(payload as any).subscribe({
        next: () => {
          this.toastService.show('Usuário criado com sucesso no banco de dados', 'success');
          this.userForm.reset();
          this.loadUsers();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.isSubmitting.set(false);
        }
      });
    }
  }

  deactivate(id: string) {
    this.userService.deactivate(id).subscribe({
      next: () => {
        this.toastService.show('Usuário inativado com sucesso', 'success');
        this.loadUsers();
      }
    });
  }
}