import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../../shared/customer.service';
import { ConsultationModalService } from '../../../pages/consultation/consultation-modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected readonly consultation = inject(ConsultationModalService);
  protected readonly customerService = inject(CustomerService);

  isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  openConsultation(event: Event): void {
    event.preventDefault();
    this.consultation.open();
  }
}
