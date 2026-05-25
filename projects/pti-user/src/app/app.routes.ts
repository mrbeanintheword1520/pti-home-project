import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { Home } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: Home, pathMatch: 'full' },
      { path: 'phan-tich-thi-truong', loadComponent: () => import('./pages/market-analysis/market-analysis.component').then(m => m.MarketAnalysisComponent) },
      { path: 'ban-do-du-an', loadComponent: () => import('./pages/market-analysis/market-analysis.component').then(m => m.MarketAnalysisComponent) },
      { path: 'du-an', component: ProjectsComponent },
      { path: 'cong-cu', loadComponent: () => import('./pages/investment-tool/investment-tool.component').then(m => m.InvestmentToolComponent) },
      { path: 'tinh-khoan-vay', loadComponent: () => import('./pages/loan-calculator/loan-calculator.component').then(m => m.LoanCalculator) },
      { path: 've-chung-toi', component: AboutComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
