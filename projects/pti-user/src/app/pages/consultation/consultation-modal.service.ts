import { Injectable, signal } from '@angular/core';

export interface ConsultationFormData {
  purpose: string;
  budget: string;
  need: string;
  name: string;
  phone: string;
  email: string;
  note: string;
}

const emptyForm = (): ConsultationFormData => ({
  purpose: '',
  budget: '',
  need: '',
  name: '',
  phone: '',
  email: '',
  note: '',
});

@Injectable({ providedIn: 'root' })
export class ConsultationModalService {
  readonly isOpen = signal(false);
  readonly currentStep = signal(1);
  readonly formData = signal<ConsultationFormData>(emptyForm());

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.currentStep.set(1);
    this.formData.set(emptyForm());
  }

  nextStep(): void {
    if (this.currentStep() < 4) {
      this.currentStep.update((s) => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((s) => s - 1);
    }
  }

  setField<K extends keyof ConsultationFormData>(
    key: K,
    value: ConsultationFormData[K],
  ): void {
    this.formData.update((data) => ({ ...data, [key]: value }));
  }
}
