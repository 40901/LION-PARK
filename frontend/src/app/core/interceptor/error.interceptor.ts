import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (req.url.includes('/auth/login')) {
          toastService.show(error.error?.message || 'E-mail ou senha incorretos.', 'error');
        } else {
          toastService.show('Sessão expirada. Faça login novamente.', 'error');
          authService.logout();
        }
      } else if (error.error && error.error.message) {
        toastService.show(error.error.message, 'error');
      } else {
        toastService.show('Ocorreu um erro ao processar a requisição.', 'error');
      }
      return throwError(() => error);
    })
  );
};