import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CATEGORY_TABS,
  PROJECT_STATS,
  PROJECTS,
  ProjectCategory,
  ProjectItem,
  ProjectStatus,
  STATUS_LABELS,
} from './projects.data';

interface FilterState {
  search: string;
  area: string;
  priceRange: string;
  categories: ProjectCategory[];
  statuses: ProjectStatus[];
  amenities: string[];
}

@Component({
  selector: 'app-projects',
  imports: [FormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  readonly stats = PROJECT_STATS;
  readonly tabs = CATEGORY_TABS;
  readonly statusLabels = STATUS_LABELS;
  readonly allProjects = PROJECTS;

  readonly areaOptions = ['Tất cả', 'Bình Dương', 'Bình Phước', 'Vũng Tàu', 'TP Bến Cát'];
  readonly priceOptions = ['Tất cả', 'Dưới 1 tỷ', '1 - 3 tỷ', 'Trên 3 tỷ', 'Liên hệ'];
  readonly sortOptions = ['Mới nhất', 'Giá thấp → cao', 'Giá cao → thấp', 'Tiềm năng cao'];
  readonly filterCategories = [
    { id: 'can-ho' as const, label: 'Căn hộ' },
    { id: 'dat-nen' as const, label: 'Đất nền' },
    { id: 'nghi-duong' as const, label: 'Nghỉ dưỡng' },
  ];
  readonly statusFilters = [
    { id: 'selling' as const, label: 'Đang mở bán' },
    { id: 'coming' as const, label: 'Sắp mở bán' },
    { id: 'delivered' as const, label: 'Đã bàn giao' },
  ];
  readonly amenityFilters = ['Hồ bơi', 'Công viên', 'Trung tâm thương mại', 'Trường học', 'Bệnh viện'];

  activeTab = signal<ProjectCategory>('all');
  sortBy = signal('Mới nhất');
  viewMode = signal<'grid' | 'list'>('grid');
  currentPage = signal(1);
  favorites = signal<Set<string>>(new Set());

  filters = signal<FilterState>({
    search: '',
    area: 'Tất cả',
    priceRange: 'Tất cả',
    categories: [],
    statuses: [],
    amenities: [],
  });

  readonly filteredProjects = computed(() => {
    const f = this.filters();
    const tab = this.activeTab();
    let list = [...this.allProjects];

    if (tab !== 'all') {
      list = list.filter((p) => p.category === tab);
    }

    if (f.search.trim()) {
      const q = f.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    if (f.area !== 'Tất cả') {
      list = list.filter((p) => p.location === f.area);
    }

    if (f.priceRange !== 'Tất cả') {
      list = list.filter((p) => this.matchPriceRange(p.price, f.priceRange));
    }

    if (f.categories.length) {
      list = list.filter((p) => f.categories.includes(p.category));
    }

    if (f.statuses.length) {
      list = list.filter((p) => f.statuses.includes(p.status));
    }

    list = this.sortProjects(list, this.sortBy());
    return list;
  });

  readonly totalCount = computed(() => this.filteredProjects().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalCount() / 8)));
  readonly pagedProjects = computed(() => {
    const page = this.currentPage();
    const start = (page - 1) * 8;
    return this.filteredProjects().slice(start, start + 8);
  });

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: (number | 'ellipsis')[] = [];
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - current) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== 'ellipsis') {
        pages.push('ellipsis');
      }
    }
    return pages;
  });

  setTab(tab: ProjectCategory): void {
    this.activeTab.set(tab);
    this.currentPage.set(1);
  }

  toggleFavorite(id: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favorites.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  isFavorite(id: string): boolean {
    return this.favorites().has(id);
  }

  clearFilters(): void {
    this.filters.set({
      search: '',
      area: 'Tất cả',
      priceRange: 'Tất cả',
      categories: [],
      statuses: [],
      amenities: [],
    });
    this.activeTab.set('all');
    this.currentPage.set(1);
  }

  applyFilters(): void {
    this.currentPage.set(1);
  }

  updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]): void {
    this.filters.update((f) => ({ ...f, [key]: value }));
  }

  toggleFilterCategory(id: ProjectCategory): void {
    if (id === 'all') return;
    this.filters.update((f) => {
      const cats = [...f.categories];
      const idx = cats.indexOf(id);
      if (idx >= 0) cats.splice(idx, 1);
      else cats.push(id);
      return { ...f, categories: cats };
    });
  }

  toggleFilterStatus(id: ProjectStatus): void {
    this.filters.update((f) => {
      const statuses = [...f.statuses];
      const idx = statuses.indexOf(id);
      if (idx >= 0) statuses.splice(idx, 1);
      else statuses.push(id);
      return { ...f, statuses };
    });
  }

  toggleAmenity(name: string): void {
    this.filters.update((f) => {
      const amenities = [...f.amenities];
      const idx = amenities.indexOf(name);
      if (idx >= 0) amenities.splice(idx, 1);
      else amenities.push(name);
      return { ...f, amenities };
    });
  }

  isCategoryChecked(id: ProjectCategory): boolean {
    return this.filters().categories.includes(id);
  }

  isStatusChecked(id: ProjectStatus): boolean {
    return this.filters().statuses.includes(id);
  }

  isAmenityChecked(name: string): boolean {
    return this.filters().amenities.includes(name);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  private matchPriceRange(price: string, range: string): boolean {
    const lower = price.toLowerCase();
    if (range === 'Liên hệ') return lower.includes('liên hệ');
    if (range === 'Dưới 1 tỷ') return lower.includes('triệu') || lower.includes('790');
    if (range === '1 - 3 tỷ') return lower.includes('2,8') || lower.includes('790');
    if (range === 'Trên 3 tỷ') return lower.includes('tỷ') && !lower.includes('liên');
    return true;
  }

  private sortProjects(list: ProjectItem[], sort: string): ProjectItem[] {
    const sorted = [...list];
    if (sort === 'Giá thấp → cao') {
      return sorted.sort((a, b) => this.priceWeight(a.price) - this.priceWeight(b.price));
    }
    if (sort === 'Giá cao → thấp') {
      return sorted.sort((a, b) => this.priceWeight(b.price) - this.priceWeight(a.price));
    }
    if (sort === 'Tiềm năng cao') {
      return sorted.sort(
        (a, b) =>
          parseFloat(b.growthPotential) - parseFloat(a.growthPotential),
      );
    }
    return sorted;
  }

  private priceWeight(price: string): number {
    if (price.toLowerCase().includes('liên hệ')) return 999;
    if (price.includes('Triệu')) return parseFloat(price) / 1000;
    if (price.includes('Tỷ')) return parseFloat(price.replace(',', '.'));
    return 500;
  }
}
