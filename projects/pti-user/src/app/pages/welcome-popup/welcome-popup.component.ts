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
    if (!this.formData.name.trim()) {
      alert('Vui lòng nhập họ và tên');
      return;
    }

    if (!this.formData.phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }

    const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;
    if (!phoneRegex.test(this.formData.phone.replace(/\s/g, ''))) {
      alert('Số điện thoại không hợp lệ');
      return;
    }

    if (!this.formData.interest) {
      alert('Vui lòng chọn loại hình quan tâm');
      return;
    }

    if (this.formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email.trim())) {
        alert('Email không hợp lệ');
        return;
      }
    }

    const interestLabelMap: { [key: string]: string } = {
      'can-ho': 'Căn hộ',
      'dat_nen': 'Đất nền',
      'nha_pho': 'Nhà phố',
      'nghi_duong': 'Nghỉ dưỡng',
      'khac': 'Khác'
    };

    this.customerService.saveCustomer({
      phone: this.formData.phone.trim(),
      name: this.formData.name.trim(),
      email: this.formData.email.trim() || undefined,
      interest: interestLabelMap[this.formData.interest] || this.formData.interest,
      behavior: 'Đăng ký nhận thông báo từ welcome popup'
    });

    this.close();
  }
}
