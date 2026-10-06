import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpotService } from '../../core/services/spot.service';
import { ToastService } from '../../core/services/toast.service';
import { SpotResponseDto } from '../../core/models/spot.model';

@Component({
  selector: 'app-spots',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './spots.component.html'
})
export class SpotsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private spotService = inject(SpotService);
  private toastService = inject(ToastService);

  spots = signal<SpotResponseDto[]>([]);
  isSubmitting = signal(false);

  spotForm = this.fb.group({
    identification: ['', Validators.required],
    category: ['Carro', Validators.required]
  });

  ngOnInit() {
    this.loadSpots();
  }

  loadSpots() {
    this.spotService.getAll().subscribe({
      next: (data) => this.spots.set(data),
      error: () => this.toastService.show('Erro ao carregar vagas', 'error')
    });
  }

  onSubmit() {
    if (this.spotForm.valid) {
      this.isSubmitting.set(true);
      this.spotService.create(this.spotForm.value as any).subscribe({
        next: () => {
          this.toastService.show('Vaga cadastrada com sucesso', 'success');
          this.spotForm.reset({ category: 'Carro' });
          this.loadSpots();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.isSubmitting.set(false);
        }
      });
    }
  }
}