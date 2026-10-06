import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { EntriesComponent } from './pages/entries/entries.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { SpotsComponent } from './pages/spots/spots.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { PricesComponent } from './pages/prices/prices.component';
import { SubscriptionsComponent } from './pages/subscriptions/subscriptions.component';
import { authGuard } from './core/guard/auth.guard';
import { adminGuard } from './core/guard/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'entries', component: EntriesComponent },
      { path: 'spots', component: SpotsComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'subscriptions', component: SubscriptionsComponent },
      { path: 'reports', component: ReportsComponent, canActivate: [adminGuard] },
      { path: 'prices', component: PricesComponent, canActivate: [adminGuard] },
      { path: 'users', component: UsersComponent, canActivate: [adminGuard] }
    ]
  }
];