import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SubscriptionService } from '../../core/services/subscription.service';
import { ToastService } from '../../core/services/toast.service';
import { SubscriptionStatusResponseDto } from '../../core/models/subscription.model';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './subscriptions.component.html'
})
export class SubscriptionsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private subscriptionService = inject(SubscriptionService);
  private toastService = inject(ToastService);

  subscriptions = signal<SubscriptionStatusResponseDto[]>([]);
  isSubmitting = signal(false);
  showPaymentModal = signal(false);
  selectedSubscription = signal<SubscriptionStatusResponseDto | null>(null);

  filterForm = this.fb.group({
    month: [new Date().getMonth() + 1, Validators.required],
    year: [new Date().getFullYear(), Validators.required]
  });

  paymentForm = this.fb.group({
    amount: ['', [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit() {
    this.loadStatus();
  }

  loadStatus() {
    if (this.filterForm.valid) {
      const { month, year } = this.filterForm.value;
      this.subscriptionService.getStatus(Number(month), Number(year)).subscribe({
        next: (data) => this.subscriptions.set(data),
        error: () => this.toastService.show('Erro ao buscar status', 'error')
      });
    }
  }

  openPaymentModal(sub: SubscriptionStatusResponseDto) {
    this.selectedSubscription.set(sub);
    this.paymentForm.reset();
    this.showPaymentModal.set(true);
  }

  closePaymentModal() {
    this.showPaymentModal.set(false);
    this.selectedSubscription.set(null);
  }

  confirmPayment() {
    if (this.paymentForm.valid && this.selectedSubscription()) {
      this.isSubmitting.set(true);
      const payload = {
        userId: this.selectedSubscription()!.userId,
        referenceMonth: Number(this.filterForm.value.month),
        referenceYear: Number(this.filterForm.value.year),
        amount: Number(this.paymentForm.value.amount)
      };

      this.subscriptionService.pay(payload).subscribe({
        next: () => {
          this.toastService.show('Pagamento registrado com sucesso', 'success');
          this.closePaymentModal();
          this.loadStatus();
          this.isSubmitting.set(false);
        },
        error: () => this.isSubmitting.set(false)
      });
    }
  }
}