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
      { path: 'du-an', component: ProjectsComponent },
      { path: 've-chung-toi', component: AboutComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
