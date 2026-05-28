import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../shared/customer.service';

@Component({
  selector: 'app-project-lead-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-lead-popup.component.html',
  styleUrl: './project-lead-popup.component.scss',
})
export class ProjectLeadPopupComponent implements OnInit {
  protected readonly customerService = inject(CustomerService);

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

  constructor() {
    effect(() => {
      if (this.customerService.hasCustomer()) {
        const c = this.customerService.customer();
        if (c) {
          this.name = c.name || '';
          this.phone = c.phone || '';
          this.email = c.email || '';
          if (c.interest) {
            this.interest = c.interest;
          }
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.customerService.hasCustomer()) return;

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
    const name = this.name.trim();
    const interest = this.interest;

    if (!name) {
      alert('Vui lòng nhập họ và tên!');
      return;
    }

    if (!phone) {
      alert('Vui lòng nhập số điện thoại!');
      return;
    }

    const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      alert('Số điện thoại không hợp lệ!');
      return;
    }

    if (!interest) {
      alert('Vui lòng chọn nhu cầu quan tâm!');
      return;
    }

    if (this.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email.trim())) {
        alert('Email không hợp lệ!');
        return;
      }
    }

    this.customerService.saveCustomer({
      phone,
      name,
      email: this.email.trim() || undefined,
      interest,
      behavior: `Khảo sát nhanh qua Pop-up: Quan tâm ${interest}`
    });
    this.close();
  }
}
