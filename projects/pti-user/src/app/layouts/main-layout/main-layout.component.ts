import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { Footer } from './footer/footer.component';
import { QuickConsultationModalComponent } from '../../pages/consultation/quick-consultation-modal/quick-consultation-modal.component';
import { ProjectLeadPopupComponent } from '../../pages/lead-capture/project-lead-popup/project-lead-popup.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, Footer, QuickConsultationModalComponent, ProjectLeadPopupComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {}
