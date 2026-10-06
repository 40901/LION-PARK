import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PriceRuleService } from '../../core/services/price-rule.service';
import { ToastService } from '../../core/services/toast.service';
import { PriceRuleResponseDto } from '../../core/models/price-rule.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './prices.component.html'
})
export class PricesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private priceRuleService = inject(PriceRuleService);
  private toastService = inject(ToastService);

  priceRules = signal<PriceRuleResponseDto[]>([]);
  isSubmitting = signal(false);

  priceForm = this.fb.group({
    name: ['', Validators.required],
    type: ['Hora', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.loadPriceRules();
  }

  loadPriceRules() {
    this.priceRuleService.getAll().subscribe({
      next: (data) => this.priceRules.set(data),
      error: () => this.toastService.show('Erro ao carregar regras de preço', 'error')
    });
  }

  onSubmit() {
    if (this.priceForm.valid) {
      this.isSubmitting.set(true);
      this.priceRuleService.create(this.priceForm.value as any).subscribe({
        next: () => {
          this.toastService.show('Tabela de preço cadastrada com sucesso', 'success');
          this.priceForm.reset({ type: 'Hora', price: 0 });
          this.loadPriceRules();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.isSubmitting.set(false);
        }
      });
    }
  }

  removeRule(id: string) {
    this.priceRuleService.remove(id).subscribe({
      next: () => {
        this.toastService.show('Regra removida com sucesso', 'success');
        this.loadPriceRules();
      }
    });
  }
}