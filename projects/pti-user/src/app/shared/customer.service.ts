import { Injectable, signal, computed } from '@angular/core';

export interface CustomerInfo {
  phone: string;
  name?: string;
  email?: string;
  interest?: string;
  note?: string;
  createdAt?: string;
  budget?: string;
  agent?: string;
  behavior?: string;
  source?: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly STORAGE_KEY = 'pti_customer_info';

  private customerInfo = signal<CustomerInfo | null>(this.loadFromStorage());

  readonly customer = this.customerInfo.asReadonly();
  readonly hasCustomer = computed(() => !!this.customerInfo());

  private loadFromStorage(): CustomerInfo | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private saveToStorage(info: CustomerInfo): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(info));
    } catch {
      console.warn('Could not save customer info to localStorage');
    }
  }

  saveCustomer(info: CustomerInfo): void {
    const customerData: CustomerInfo = {
      ...info,
      createdAt: new Date().toISOString()
    };
    this.customerInfo.set(customerData);
    this.saveToStorage(customerData);

    // Đồng bộ lên Mock API Server cổng 3000
    fetch('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: customerData.name || 'Khách hàng ẩn danh',
        phone: customerData.phone,
        email: customerData.email || '',
        project: customerData.interest || 'Vinhomes Grand Park',
        budget: customerData.budget || 'Chưa cập nhật',
        agent: customerData.agent || 'Nguyễn Hoàng',
        behavior: customerData.behavior || 'Đăng ký tư vấn',
        source: customerData.source || 'Facebook Ads',
        appointmentDate: customerData.appointmentDate || '',
        appointmentTime: customerData.appointmentTime || ''
      })
    }).catch(err => console.warn('Mock API Server offline:', err));
  }

  clearCustomer(): void {
    this.customerInfo.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getDisplayPhone(): string {
    const phone = this.customerInfo()?.phone;
    if (!phone) return '';
    return phone;
  }
}
