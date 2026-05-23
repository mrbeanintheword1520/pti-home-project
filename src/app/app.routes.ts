import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';

export const routes: Routes = [
  // User Routes
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      // Thêm các trang user ở đây:
      // { path: 'about', component: AboutComponent },
      // { path: 'products', component: ProductsComponent },
      // { path: 'ai-advisor', component: AiAdvisorComponent },
    ]
  },
  // Admin Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      // Thêm các trang admin ở đây:
      // { path: 'crm', component: CrmComponent },
      // { path: 'leads', component: LeadsComponent },
    ]
  },
  // Fallback Route
  { path: '**', redirectTo: '' }
];
