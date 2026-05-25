import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConsultationModalService } from '../../../pages/consultation/consultation-modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected readonly consultation = inject(ConsultationModalService);

  openConsultation(event: Event): void {
    event.preventDefault();
    this.consultation.open();
  }
}
