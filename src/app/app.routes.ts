import { Routes } from '@angular/router';
import { AccountFormComponent } from './features/account-form/account-form.component';
import { AccountsComponent } from './features/accounts/accounts.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'account', component: AccountFormComponent },
  { path: 'account/:id', component: AccountFormComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];