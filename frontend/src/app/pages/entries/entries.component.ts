import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParkingService } from '../../core/services/parking.service';
import { SpotService } from '../../core/services/spot.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { PriceRuleService } from '../../core/services/price-rule.service';
import { ToastService } from '../../core/services/toast.service';
import { ParkingRecordResponseDto } from '../../core/models/parking.model';
import { SpotResponseDto } from '../../core/models/spot.model';
import { VehicleResponseDto } from '../../core/models/vehicle.model';
import { PriceRuleResponseDto } from '../../core/models/price-rule.model';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-entries',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe],
  templateUrl: './entries.component.html'
})
export class EntriesComponent implements OnInit {
  parkingService = inject(ParkingService);
  spotService = inject(SpotService);
  vehicleService = inject(VehicleService);
  priceRuleService = inject(PriceRuleService);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);

  activeRecords = signal<ParkingRecordResponseDto[]>([]);
  availableSpots = signal<SpotResponseDto[]>([]);
  allVehicles = signal<VehicleResponseDto[]>([]);
  filteredVehicles = signal<VehicleResponseDto[]>([]);
  priceRules = signal<PriceRuleResponseDto[]>([]);
  
  isSubmitting = signal(false);
  showDropdown = signal(false);
  searchQuery = signal('');

  showExitModal = signal(false);
  selectedRecordForExit = signal<ParkingRecordResponseDto | null>(null);

  entryForm = this.fb.group({
    vehicleId: ['', Validators.required],
    parkingSpotId: ['', Validators.required]
  });

  exitForm = this.fb.group({
    priceRuleId: ['', Validators.required]
  });

  ngOnInit() {
    this.loadActiveRecords();
    this.loadAvailableSpots();
    this.loadVehicles();
    this.loadPriceRules();
  }

  loadActiveRecords() {
    this.parkingService.getActiveRecords().subscribe({
      next: (data) => this.activeRecords.set(data),
      error: () => this.toastService.show('Erro ao carregar registros', 'error')
    });
  }

  loadAvailableSpots() {
    this.spotService.getAll().subscribe({
      next: (spots) => this.availableSpots.set(spots.filter(s => !s.isOccupied))
    });
  }

  loadVehicles() {
    this.vehicleService.getAll().subscribe({
      next: (vehicles) => this.allVehicles.set(vehicles)
    });
  }

  loadPriceRules() {
    this.priceRuleService.getAll().subscribe({
      next: (rules) => this.priceRules.set(rules)
    });
  }

  onSearchVehicle(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery.set(event.target.value);
    this.entryForm.patchValue({ vehicleId: '' }); 

    if (!query) {
      this.showDropdown.set(false);
      this.filteredVehicles.set([]);
      return;
    }

    const filtered = this.allVehicles().filter(v => 
      v.licensePlate.toLowerCase().includes(query) || 
      v.ownerName?.toLowerCase().includes(query)
    );
    
    this.filteredVehicles.set(filtered);
    this.showDropdown.set(true);
  }

  selectVehicle(vehicle: VehicleResponseDto) {
    this.entryForm.patchValue({ vehicleId: vehicle.id });
    this.searchQuery.set(`${vehicle.licensePlate} - ${vehicle.ownerName}`);
    this.showDropdown.set(false);
  }

  hideDropdown() {
    setTimeout(() => this.showDropdown.set(false), 200);
  }

  registerEntry() {
    if (this.entryForm.valid) {
      this.isSubmitting.set(true);
      this.parkingService.registerEntry(this.entryForm.value as any).subscribe({
        next: () => {
          this.toastService.show('Entrada registrada com sucesso', 'success');
          this.entryForm.reset({ parkingSpotId: '', vehicleId: '' });
          this.searchQuery.set('');
          this.loadActiveRecords();
          this.loadAvailableSpots();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.isSubmitting.set(false);
        }
      });
    }
  }

  openExitModal(record: ParkingRecordResponseDto) {
    this.selectedRecordForExit.set(record);
    this.exitForm.reset({ priceRuleId: '' });
    this.showExitModal.set(true);
  }

  closeExitModal() {
    this.showExitModal.set(false);
    this.selectedRecordForExit.set(null);
  }

  confirmExit() {
    if (this.exitForm.valid && this.selectedRecordForExit()) {
      this.isSubmitting.set(true);
      
      const payload = {
        parkingRecordId: this.selectedRecordForExit()!.id,
        priceRuleId: this.exitForm.value.priceRuleId
      };

      this.parkingService.registerExit(payload as any).subscribe({
        next: () => {
          this.toastService.show('Saída registrada. Cobrança processada.', 'success');
          this.closeExitModal();
          this.loadActiveRecords();
          this.loadAvailableSpots();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.isSubmitting.set(false);
        }
      });
    }
  }
}