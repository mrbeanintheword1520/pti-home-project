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
  area?: string;
  address?: string;
  appointments?: any[];
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

  constructor() {
    this.syncLocalCustomerToServer();
  }

  syncLocalCustomerToServer(): void {
    const current = this.customerInfo();
    if (!current || !current.phone) return;
    
    const norm = current.phone.replace(/\D/g, '');
    fetch(`http://localhost:3000/api/leads?phone=${norm}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        if (res.status === 404) {
          console.log(`Lead ${current.phone} not found on server. Re-registering...`);
          this.saveCustomer(current);
          return null;
        }
        throw new Error('Server error');
      })
      .then(serverLead => {
        if (serverLead) {
          const merged: CustomerInfo = {
            phone: serverLead.phone,
            name: serverLead.name,
            email: serverLead.email,
            interest: serverLead.project,
            area: serverLead.subdivision,
            budget: serverLead.budget,
            agent: serverLead.agent,
            behavior: serverLead.behavior,
            source: serverLead.source,
            appointmentDate: serverLead.appointmentDate,
            appointmentTime: serverLead.appointmentTime,
            createdAt: serverLead.createdAt,
            address: serverLead.address,
            appointments: serverLead.appointments || []
          };
          this.customerInfo.set(merged);
          this.saveToStorage(merged);
        }
      })
      .catch(err => {
        console.warn('Auto sync local customer to server failed:', err);
      });
  }

  private saveToStorage(info: CustomerInfo): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(info));
    } catch {
      console.warn('Could not save customer info to localStorage');
    }
  }

  saveCustomer(info: CustomerInfo): void {
    const current = this.customerInfo();
    const customerData: CustomerInfo = {
      ...current,
      ...info,
      createdAt: info.createdAt || current?.createdAt || new Date().toISOString()
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
        address: customerData.address || 'Đang cập nhật',
        project: customerData.interest || 'Vinhomes Grand Park',
        subdivision: customerData.area || 'TP. Hồ Chí Minh',
        budget: customerData.budget || 'Chưa cập nhật',
        agent: customerData.agent || 'Nguyễn Hoàng',
        behavior: customerData.behavior || 'Đăng ký tư vấn',
        source: customerData.source || 'Facebook Ads',
        appointmentDate: customerData.appointmentDate || '',
        appointmentTime: customerData.appointmentTime || ''
      })
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('Sync failed');
    })
    .then(serverLead => {
      // Sync agent / fields updated on server back to local
      if (serverLead) {
        const merged: CustomerInfo = {
          phone: serverLead.phone,
          name: serverLead.name,
          email: serverLead.email,
          interest: serverLead.project,
          area: serverLead.subdivision,
          budget: serverLead.budget,
          agent: serverLead.agent,
          behavior: serverLead.behavior,
          source: serverLead.source,
          appointmentDate: serverLead.appointmentDate,
          appointmentTime: serverLead.appointmentTime,
          createdAt: serverLead.createdAt,
          address: serverLead.address,
          appointments: serverLead.appointments || []
        };
        this.customerInfo.set(merged);
        this.saveToStorage(merged);
      }
    })
    .catch(err => console.warn('Mock API Server offline or sync failed:', err));
  }

  fetchCustomerInfoFromServer(phone: string): void {
    const norm = phone.replace(/\D/g, '');
    fetch(`http://localhost:3000/api/leads?phone=${norm}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not found');
      })
      .then(serverLead => {
        if (serverLead) {
          const merged: CustomerInfo = {
            phone: serverLead.phone,
            name: serverLead.name,
            email: serverLead.email,
            interest: serverLead.project,
            area: serverLead.subdivision,
            budget: serverLead.budget,
            agent: serverLead.agent,
            behavior: serverLead.behavior,
            source: serverLead.source,
            appointmentDate: serverLead.appointmentDate,
            appointmentTime: serverLead.appointmentTime,
            createdAt: serverLead.createdAt,
            address: serverLead.address,
            appointments: serverLead.appointments || []
          };
          this.customerInfo.set(merged);
          this.saveToStorage(merged);
        }
      })
      .catch(err => console.warn('Could not sync customer from server:', err));
  }

  trackInteraction(projectName: string, click: boolean, durationSeconds: number): void {
    const current = this.customerInfo();
    const phone = current?.phone || '0123456789'; // Mặc định số điện thoại nếu chưa đăng ký/đăng nhập
    
    // Lưu tạm thời vào localStorage để tránh mất dữ liệu nếu offline
    const localInteractionsKey = `pti_interactions_${phone}`;
    let localInts: Record<string, { clicks: number; durationSeconds: number }> = {};
    try {
      const data = localStorage.getItem(localInteractionsKey);
      if (data) localInts = JSON.parse(data);
    } catch {}

    if (!localInts[projectName]) {
      localInts[projectName] = { clicks: 0, durationSeconds: 0 };
    }
    if (click) localInts[projectName].clicks += 1;
    if (durationSeconds) localInts[projectName].durationSeconds += durationSeconds;

    try {
      localStorage.setItem(localInteractionsKey, JSON.stringify(localInts));
    } catch {}

    // Gửi realtime lên API server
    fetch('http://localhost:3000/api/leads/interaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone,
        project: projectName,
        click,
        durationSeconds
      })
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('Realtime interaction sync failed');
    })
    .catch(err => {
      console.warn('Backend server interaction offline:', err);
    });
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
