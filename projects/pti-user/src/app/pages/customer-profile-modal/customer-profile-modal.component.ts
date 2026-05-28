import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerProfileModalService } from './customer-profile-modal.service';
import { CustomerService } from '../../shared/customer.service';

@Component({
  selector: 'app-customer-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-profile-modal.component.html',
  styleUrl: './customer-profile-modal.component.scss'
})
export class CustomerProfileModalComponent {
  protected readonly modalService = inject(CustomerProfileModalService);
  protected readonly customerService = inject(CustomerService);

  name = '';
  phone = '';
  email = '';
  address = '';
  interest = '';
  budget = '';

  successMessage = '';
  errorMessage = '';

  readonly allProjects = [
    'Vinhomes Saigon Park',
    'Vinhomes Grand Park',
    'Dự Án The Felix',
    'Dự Án The Infinity Dĩ An',
    'The SeaHorse Central Bình Phước',
    'Gold Coast Vũng Tàu',
    'Lan Anh AVENUE',
    'Dự Án Gia Khải Luxury',
    'Dự Án Khánh Bình'
  ];

  readonly budgetOptions = [
    'Dưới 2 tỷ',
    '2 - 5 tỷ',
    '5 - 10 tỷ',
    '10 - 20 tỷ',
    'Trên 20 tỷ'
  ];

  constructor() {
    effect(() => {
      const c = this.customerService.customer();
      if (c) {
        this.name = c.name || '';
        this.phone = c.phone || '';
        this.email = c.email || '';
        this.address = c.address && c.address !== 'Đang cập nhật' ? c.address : '';
        this.interest = c.interest || '';
        this.budget = c.budget && c.budget !== 'Chưa cập nhật' ? c.budget : '';
      }
    });
  }

  close(): void {
    this.modalService.close();
    this.successMessage = '';
    this.errorMessage = '';
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.name.trim()) {
      this.errorMessage = 'Họ và tên không được để trống!';
      return;
    }

    if (this.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email.trim())) {
        this.errorMessage = 'Email không hợp lệ!';
        return;
      }
    }

    // Save and sync
    this.customerService.saveCustomer({
      phone: this.phone,
      name: this.name.trim(),
      email: this.email.trim(),
      address: this.address.trim() || 'Đang cập nhật',
      interest: this.interest,
      budget: this.budget || 'Chưa cập nhật',
      behavior: 'Cập nhật thông tin cá nhân trên Portal'
    });

    this.successMessage = 'Cập nhật thông tin thành công!';
    setTimeout(() => {
      this.close();
    }, 1500);
  }
}
