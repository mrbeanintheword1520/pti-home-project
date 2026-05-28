import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { Footer } from './footer/footer.component';
import { WelcomePopupComponent } from '../../pages/welcome-popup/welcome-popup.component';
import { QuickConsultationModalComponent } from '../../pages/consultation/quick-consultation-modal/quick-consultation-modal.component';
import { MarketSurveyModalComponent } from '../../pages/consultation/market-survey-modal/market-survey-modal.component';
import { CustomerProfileModalComponent } from '../../pages/customer-profile-modal/customer-profile-modal.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    Footer,
    WelcomePopupComponent,
    QuickConsultationModalComponent,
    MarketSurveyModalComponent,
    CustomerProfileModalComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent { }