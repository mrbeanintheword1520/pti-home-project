import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../shared/customer.service';

@Component({
  selector: 'app-welcome-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './welcome-popup.component.html',
  styleUrl: './welcome-popup.component.scss'
})
export class WelcomePopupComponent implements OnInit, OnDestroy {
  private customerService = inject(CustomerService);

  isVisible = signal(false);

  formData = {
    phone: '',
    name: '',
    email: '',
    interest: ''
  };

  interestOptions = [
    { value: 'can-ho', label: 'Căn hộ' },
    { value: 'dat_nen', label: 'Đất nền' },
    { value: 'nha_pho', label: 'Nhà phố' },
    { value: 'nghi_duong', label: 'Nghỉ dưỡng' },
    { value: 'khac', label: 'Khác' }
  ];

  ngOnInit(): void {
    if (!this.customerService.hasCustomer()) {
      setTimeout(() => {
        this.isVisible.set(true);
      }, 1000);
    }
  }

  ngOnDestroy(): void {
  }

  close(): void {
    this.isVisible.set(false);
  }

  onSubmit(): void {
    if (!this.formData.phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }

    const phoneRegex = /(0[0-9]{9,10})/;
    if (!phoneRegex.test(this.formData.phone.trim())) {
      alert('Số điện thoại không hợp lệ');
      return;
    }

    this.customerService.saveCustomer({
      phone: this.formData.phone.trim(),
      name: this.formData.name.trim() || undefined,
      email: this.formData.email.trim() || undefined,
      interest: this.formData.interest || undefined
    });

    this.close();
  }
}
