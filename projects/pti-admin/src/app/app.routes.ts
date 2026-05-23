import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { Dashboard } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: Dashboard, pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
