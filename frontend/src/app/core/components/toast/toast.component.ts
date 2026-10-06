import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="px-5 py-4 rounded-xl shadow-2xl text-white flex items-center gap-4 animate-fade-in-up min-w-[300px] border border-white/10 backdrop-blur-md"
          [ngClass]="{
            'bg-emerald-600': toast.type === 'success',
            'bg-rose-600': toast.type === 'error',
            'bg-blue-600': toast.type === 'info'
          }"
        >
          @if (toast.type === 'success') { <div class="i-mdi-check-circle text-2xl drop-shadow-md"></div> }
          @if (toast.type === 'error') { <div class="i-mdi-alert-circle text-2xl drop-shadow-md"></div> }
          @if (toast.type === 'info') { <div class="i-mdi-information text-2xl drop-shadow-md"></div> }
          <span class="font-semibold tracking-wide flex-1">{{ toast.message }}</span>
          <button (click)="toastService.remove(toast.id)" class="hover:opacity-75 transition-opacity bg-white/20 p-1 rounded-full flex items-center justify-center">
            <div class="i-mdi-close text-xl"></div>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}