import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent {
  accounts = signal<any[]>([]);
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(
    private service: AccountService,
    private router: Router,
  ) {
    this.loadAccounts();
  }

  loadAccounts() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.service.getAll().subscribe({
      next: (res) => {
        this.accounts.set(res || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load accounts.');
        this.isLoading.set(false);
      },
    });
  }

  delete(accountNumber: string) {
    if (!confirm('Are you sure you want to delete this account?')) return;

    this.service.delete(accountNumber).subscribe({
      next: () => {
        // Remove deleted account from signal
        const updatedAccounts = this.accounts().filter(
          (acc) => acc.accountNumber !== accountNumber,
        );
        this.accounts.set(updatedAccounts);
      },
      error: (err) => {
        console;
        this.errorMessage.set('Failed to delete account.');
      },
    });
  }

  edit(accountNumber: string) {
    this.router.navigate(['/account', accountNumber]);
  }

  logout() {
    localStorage.removeItem('token');
    this.accounts.set([]);
    this.errorMessage.set(null);
    this.isLoading.set(false);
    this.router.navigate(['/login']);
  }

  create() {
    this.router.navigate(['/account']);
  }
}
