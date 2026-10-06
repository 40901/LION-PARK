import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParkingService } from '../../core/services/parking.service';
import { ToastService } from '../../core/services/toast.service';
import { ParkingRecordResponseDto } from '../../core/models/parking.model';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe],
  templateUrl: './reports.component.html'
})
export class ReportsComponent {
  fb = inject(FormBuilder);
  parkingService = inject(ParkingService);
  toastService = inject(ToastService);

  records = signal<ParkingRecordResponseDto[]>([]);
  totalAmount = signal<number>(0);
  isSubmitting = signal(false);

  reportForm = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });

  generateReport() {
    if (this.reportForm.valid) {
      this.isSubmitting.set(true);
      const { startDate, endDate } = this.reportForm.value;

      const end = new Date(endDate!);
      end.setHours(23, 59, 59, 999);

      this.parkingService.getReport(
        new Date(startDate!).toISOString(),
        end.toISOString()
      ).subscribe({
        next: (data) => {
          this.records.set(data);
          const sum = data.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
          this.totalAmount.set(sum);
          this.isSubmitting.set(false);
          if(data.length === 0) this.toastService.show('Nenhum registro encontrado no período.', 'info');
        },
        error: () => {
          this.toastService.show('Erro ao gerar relatório', 'error');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}