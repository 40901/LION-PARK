import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  
  const user = authService.currentUser();

  if (user && user.role === 'Admin') {
    return true;
  }

  toastService.show('Acesso negado. Área restrita a administradores.', 'error');
  return router.parseUrl('/dashboard');
};