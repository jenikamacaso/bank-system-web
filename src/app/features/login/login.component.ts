import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, NgIf, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // <-- add your CSS file
})
export class LoginComponent {
  // Use signals for reactive state
  form = signal({ username: '', password: '' });
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    const { username, password } = this.form();

    if (!username || !password) {
      this.errorMessage.set('Please enter username and password');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.auth.login({ username, password }).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);
        this.isLoading.set(false);
        this.router.navigate(['/accounts']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Login failed. Check credentials.'
        );
      },
    });
  }
}
