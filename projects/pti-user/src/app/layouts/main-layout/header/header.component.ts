import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../../shared/customer.service';
import { ConsultationModalService } from '../../../pages/consultation/consultation-modal.service';
import { CustomerProfileModalService } from '../../../pages/customer-profile-modal/customer-profile-modal.service';

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
  protected readonly profileModal = inject(CustomerProfileModalService);

  openConsultation(event: Event): void {
    event.preventDefault();
    this.consultation.open();
  }

  openProfile(event: Event): void {
    event.preventDefault();
    this.profileModal.open();
  }
}
