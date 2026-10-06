import { Component, inject } from '@angular/core';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (dialogService.isOpen()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scale-in border border-slate-100 m-4">
          <div class="p-8">
            <div class="flex items-center gap-4 text-slate-800 mb-5">
              <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <div class="i-mdi-help-circle text-3xl text-blue-600"></div>
              </div>
              <h3 class="text-2xl font-black tracking-tight">{{ dialogService.options()?.title }}</h3>
            </div>
            <p class="text-slate-600 text-lg mb-8 leading-relaxed">{{ dialogService.options()?.message }}</p>
            <div class="flex justify-end gap-4">
              <button (click)="dialogService.close(false)" class="px-6 py-3 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                {{ dialogService.options()?.cancelText || 'Cancelar' }}
              </button>
              <button (click)="dialogService.close(true)" class="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                {{ dialogService.options()?.confirmText || 'Confirmar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
  dialogService = inject(ConfirmDialogService);
}