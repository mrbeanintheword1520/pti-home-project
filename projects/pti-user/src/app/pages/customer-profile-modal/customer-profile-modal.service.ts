import { Injectable, inject, signal } from '@angular/core';
import { CustomerService } from '../../shared/customer.service';

@Injectable({ providedIn: 'root' })
export class CustomerProfileModalService {
  private readonly customerService = inject(CustomerService);
  readonly isOpen = signal(false);

  open(): void {
    const phone = this.customerService.getDisplayPhone();
    if (phone) {
      // Sync from server to make sure we have the latest details
      this.customerService.fetchCustomerInfoFromServer(phone);
    }
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
