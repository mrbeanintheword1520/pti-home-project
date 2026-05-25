import { Injectable, signal } from '@angular/core';

export interface LeadCaptureData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  createdAt: string;
}

const CUSTOMER_KEY = 'pti_home_customer_phone';
const LEADS_KEY = 'pti_home_customer_leads';

@Injectable({ providedIn: 'root' })
export class LeadCaptureService {
  readonly customerPhone = signal(this.readCustomerPhone());

  saveLead(data: Omit<LeadCaptureData, 'createdAt'>): void {
    const lead: LeadCaptureData = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    const leads = this.readLeads();
    leads.unshift(lead);

    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    localStorage.setItem(CUSTOMER_KEY, lead.phone);
    this.customerPhone.set(lead.phone);

    // TODO: POST lead to admin API when backend endpoint is ready.
  }

  setCustomerPhone(phone: string): void {
    localStorage.setItem(CUSTOMER_KEY, phone);
    this.customerPhone.set(phone);
  }

  hasSubmitted(): boolean {
    return !!this.customerPhone();
  }

  private readCustomerPhone(): string {
    return localStorage.getItem(CUSTOMER_KEY) ?? '';
  }

  private readLeads(): LeadCaptureData[] {
    const raw = localStorage.getItem(LEADS_KEY);
    if (!raw) return [];

    try {
      return JSON.parse(raw) as LeadCaptureData[];
    } catch {
      return [];
    }
  }
}
