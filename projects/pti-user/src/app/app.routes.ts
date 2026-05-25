import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { Home } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: Home, pathMatch: 'full' },
      { path: 'phan-tich-thi-truong', loadComponent: () => import('./pages/market-analysis/market-analysis.component').then(m => m.MarketAnalysisComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
