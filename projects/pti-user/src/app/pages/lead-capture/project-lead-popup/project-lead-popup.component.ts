import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeadCaptureService } from '../lead-capture.service';

@Component({
  selector: 'app-project-lead-popup',
  imports: [FormsModule],
  templateUrl: './project-lead-popup.component.html',
  styleUrl: './project-lead-popup.component.scss',
})
export class ProjectLeadPopupComponent implements OnInit {
  private readonly leadCapture = inject(LeadCaptureService);

  readonly isOpen = signal(false);
  name = '';
  email = '';
  phone = '';
  interest = '';
  submitted = false;

  readonly interestOptions = [
    'Căn hộ cao cấp',
    'Nhà phố thương mại',
    'Đất nền',
    'Bất động sản nghỉ dưỡng',
    'Cần tư vấn thêm',
  ];

  ngOnInit(): void {
    if (this.leadCapture.hasSubmitted()) return;

    window.setTimeout(() => {
      this.isOpen.set(true);
    }, 2500);
  }

  close(): void {
    this.isOpen.set(false);
  }

  submit(): void {
    this.submitted = true;
    const phone = this.phone.trim();
    if (!phone) return;

    this.leadCapture.saveLead({
      name: this.name.trim(),
      email: this.email.trim(),
      phone,
      interest: this.interest,
    });
    this.close();
  }
}
