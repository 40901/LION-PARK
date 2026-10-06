import { Component, inject, OnInit, signal } from '@angular/core';
import { ParkingService } from '../../core/services/parking.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  parkingService = inject(ParkingService);
  toastService = inject(ToastService);

  activeCount = signal<number>(0);

  ngOnInit() {
    this.parkingService.getActiveRecords().subscribe({
      next: (records) => this.activeCount.set(records.length),
      error: () => this.toastService.show('Erro ao carregar métricas', 'error')
    });
  }
}