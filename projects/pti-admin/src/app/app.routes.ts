import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { Dashboard } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: Dashboard, pathMatch: 'full' },
      { path: 'khach-hang', loadComponent: () => import('./pages/smart-leads/smart-leads.component').then(m => m.SmartLeadsComponent) },
      { path: 'danh-sach-lead', loadComponent: () => import('./pages/smart-leads/smart-leads.component').then(m => m.SmartLeadsComponent) },
      { path: 'crm', loadComponent: () => import('./pages/crm/crm.component').then(m => m.CrmComponent) },
      { path: 'lich-hen', loadComponent: () => import('./pages/lich-hen/lich-hen.component').then(m => m.LichHenComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
