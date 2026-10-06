import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  
  isSubmitting = signal(false);

  registerForm = this.fb.group({
    fullName: ['', Validators.required],
    cpf: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting.set(true);

      const payload = {
        fullName: this.registerForm.value.fullName,
        cpf: this.registerForm.value.cpf,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: 'Operator'
      };

      this.userService.create(payload as any).subscribe({
        next: () => {
          this.toastService.show('Conta criada com sucesso! Faça seu login.', 'success');
          this.router.navigate(['/login']);
          this.isSubmitting.set(false);
        },
        error: () => {
          this.isSubmitting.set(false);
        }
      });
    }
  }
}