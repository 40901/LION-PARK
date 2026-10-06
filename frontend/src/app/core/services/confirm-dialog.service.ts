import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  isOpen = signal(false);
  options = signal<ConfirmOptions | null>(null);
  private responseSubject = new Subject<boolean>();

  confirm(options: ConfirmOptions) {
    this.options.set(options);
    this.isOpen.set(true);
    this.responseSubject = new Subject<boolean>();
    return this.responseSubject.asObservable();
  }

  close(result: boolean) {
    this.isOpen.set(false);
    this.responseSubject.next(result);
    this.responseSubject.complete();
  }
}