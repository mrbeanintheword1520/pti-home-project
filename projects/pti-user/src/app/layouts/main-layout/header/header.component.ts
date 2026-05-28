import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../../shared/customer.service';
import { ConsultationModalService } from '../../../pages/consultation/consultation-modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected readonly consultation = inject(ConsultationModalService);
  protected readonly customerService = inject(CustomerService);

  isMobileMenuOpen = signal(false);
  isSearchOpen = signal(false);
  searchKeyword = signal('');
  searchResults = signal<any[]>([]);

  mockProjects = [
    { id: 1, name: 'Dự án Vinhomes Grand Park', location: 'Quận 9, TP. Thủ Đức', url: '/du-an/vinhomes-grand-park' },
    { id: 2, name: 'Khu đô thị Sala', location: 'Quận 2, TP. Thủ Đức', url: '/du-an/sala' },
    { id: 3, name: 'Khu dân cư sinh thái', location: 'Huyện Hóc Môn, TP.HCM', url: '/du-an/hoc-mon' },
    { id: 4, name: 'Sunrise City', location: 'Quận 7, TP.HCM', url: '/du-an/sunrise-city' },
    { id: 5, name: 'Celadon City', location: 'Quận Tân Phú, TP.HCM', url: '/du-an/celadon-city' }
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  toggleSearch(): void {
    this.isSearchOpen.update(v => !v);
    if (!this.isSearchOpen()) {
      this.searchKeyword.set('');
      this.searchResults.set([]);
    }
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchKeyword.set(value);
    
    if (value.trim()) {
      const lowerKeyword = value.toLowerCase();
      const results = this.mockProjects.filter(p => 
        p.name.toLowerCase().includes(lowerKeyword) || 
        p.location.toLowerCase().includes(lowerKeyword)
      );
      this.searchResults.set(results);
    } else {
      this.searchResults.set([]);
    }
  }

  onSearch(keyword: string): void {
    if (keyword.trim()) {
      console.log('Tìm kiếm:', keyword);
      // TODO: Thêm logic điều hướng hoặc tìm kiếm ở đây
    }
  }

  openConsultation(event: Event): void {
    event.preventDefault();
    this.consultation.open();
  }
}
