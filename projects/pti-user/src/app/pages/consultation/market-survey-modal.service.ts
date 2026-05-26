import { Injectable, signal } from '@angular/core';

export interface MarketSurveyFormData {
  area: string;
  project: string;
  purpose: string; // 'invest' | 'live' | 'rent' | 'research'
  budget: string;
  specialNeed: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  timeSlot: string;
  selectedExpertId: string;
}

const emptyForm = (): MarketSurveyFormData => ({
  area: '',
  project: '',
  purpose: 'invest', // Mặc định: Đầu tư
  budget: '',
  specialNeed: '',
  name: '',
  phone: '',
  email: '',
  date: '',
  timeSlot: '',
  selectedExpertId: 'nguyen-hoang', // Mặc định: Nguyễn Hoàng
});

@Injectable({ providedIn: 'root' })
export class MarketSurveyModalService {
  readonly isOpen = signal(false);
  readonly currentStep = signal(1); // Bước từ 1 đến 4, Bước 5 là Màn hình thành công
  readonly formData = signal<MarketSurveyFormData>(emptyForm());

  open(projectName?: string): void {
    const defaultData = emptyForm();
    if (projectName) {
      defaultData.project = projectName;
      defaultData.area = this.resolveRegion(projectName);
    }
    this.formData.set(defaultData);
    this.currentStep.set(1);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  nextStep(): void {
    this.currentStep.update((s) => s + 1);
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((s) => s - 1);
    }
  }

  setField<K extends keyof MarketSurveyFormData>(
    key: K,
    value: MarketSurveyFormData[K],
  ): void {
    this.formData.update((data) => ({ ...data, [key]: value }));
  }

  private resolveRegion(projectName: string): string {
    const nameLower = projectName.toLowerCase();
    if (
      nameLower.includes('vinhomes') ||
      nameLower.includes('hồ chí minh') ||
      nameLower.includes('thủ đức') ||
      nameLower.includes('hóc môn') ||
      nameLower.includes('saigon park')
    ) {
      return 'TP. Hồ Chí Minh';
    }
    if (
      nameLower.includes('felix') ||
      nameLower.includes('infinity') ||
      nameLower.includes('lan anh') ||
      nameLower.includes('gia khải') ||
      nameLower.includes('khánh bình') ||
      nameLower.includes('bình dương') ||
      nameLower.includes('bến cát') ||
      nameLower.includes('dĩ an')
    ) {
      return 'Bình Dương';
    }
    if (nameLower.includes('seahorse') || nameLower.includes('bình phước')) {
      return 'Bình Phước';
    }
    if (nameLower.includes('gold coast') || nameLower.includes('vũng tàu')) {
      return 'Vũng Tàu';
    }
    return '';
  }
}
