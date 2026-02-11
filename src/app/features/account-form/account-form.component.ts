import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';

@Component({
  standalone: true,
  selector: 'app-account-form',
  imports: [FormsModule, NgIf],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css'],
})
export class AccountFormComponent {
  private service = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  isEditMode = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');
  isLoading = signal(false);

  form = {
    accountNumber: '',
    customerName: '',
    accountType: 'Savings',
    accountStatus: 'Active',
  };

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.isLoading.set(true);

      this.service.getById(id).subscribe({
        next: (acc: any) => {
          this.form = acc;
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Failed to load account details.');
          this.isLoading.set(false);
        },
      });
    }
  }

  save() {
    this.isSaving.set(true);
    this.errorMessage.set('');

    const request = this.isEditMode()
      ? this.service.update(this.form.accountNumber, this.form)
      : this.service.create(this.form);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/accounts']);
      },
      error: (err) => {
        this.isSaving.set(false);

        if (err?.error?.message?.includes('exists') || err?.error?.message?.includes('UNIQUE')) {
          this.errorMessage.set('Account number already exists.');
        } else {
          this.errorMessage.set('Failed to save account.');
        }
      },
    });
  }

  cancel() {
    this.router.navigate(['/accounts']);
  }
}
