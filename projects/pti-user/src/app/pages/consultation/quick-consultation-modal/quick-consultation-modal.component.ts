import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConsultationModalService } from '../consultation-modal.service';
import { BRAND } from '../../../shared/brand';

interface SelectOption {
  id: string;
  title: string;
  description: string;
  icon: 'home' | 'chart' | 'key' | 'search' | 'wallet' | 'building' | 'land' | 'help';
}

interface StepConfig {
  step: number;
  label: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-quick-consultation-modal',
  imports: [FormsModule],
  templateUrl: './quick-consultation-modal.component.html',
  styleUrl: './quick-consultation-modal.component.scss',
})
export class QuickConsultationModalComponent {
  protected readonly modal = inject(ConsultationModalService);
  protected readonly brand = BRAND;

  readonly steps: StepConfig[] = [
    { step: 1, label: 'Mục đích', title: 'Xin chào! Bạn đang quan tâm đến bất động sản để làm mục đích gì?', subtitle: `${BRAND.shortName} sẽ tư vấn giải pháp phù hợp nhất cho bạn` },
    { step: 2, label: 'Ngân sách', title: 'Ngân sách dự kiến của bạn là bao nhiêu?', subtitle: 'Giúp chúng tôi gợi ý dự án phù hợp với khả năng tài chính' },
    { step: 3, label: 'Nhu cầu', title: 'Bạn đang quan tâm loại hình nào?', subtitle: 'Chọn một hoặc nhiều hướng phù hợp với nhu cầu của bạn' },
    { step: 4, label: 'Thông tin liên hệ', title: 'Để lại thông tin để nhận tư vấn', subtitle: `Chuyên gia ${BRAND.shortName} sẽ liên hệ trong vòng 24 giờ` },
  ];

  readonly purposeOptions: SelectOption[] = [
    { id: 'live', title: 'Mua để ở', description: 'Tìm nơi an cư, nâng cao chất lượng sống', icon: 'home' },
    { id: 'invest', title: 'Đầu tư', description: 'Tìm kiếm lợi nhuận, gia tăng tài sản', icon: 'chart' },
    { id: 'rent', title: 'Cho thuê', description: 'Khai thác dòng tiền hàng tháng', icon: 'key' },
    { id: 'research', title: 'Tìm hiểu thị trường', description: 'Chỉ muốn tham khảo thông tin', icon: 'search' },
  ];

  readonly budgetOptions: SelectOption[] = [
    { id: 'under-2', title: 'Dưới 2 tỷ', description: 'Căn hộ, studio, đất nền vùng ven', icon: 'wallet' },
    { id: '2-5', title: '2 – 5 tỷ', description: 'Căn hộ trung cấp, nhà phố', icon: 'wallet' },
    { id: '5-10', title: '5 – 10 tỷ', description: 'Căn hộ cao cấp, biệt thự', icon: 'wallet' },
    { id: 'over-10', title: 'Trên 10 tỷ', description: 'Bất động sản hạng sang, đầu tư lớn', icon: 'wallet' },
  ];

  readonly needOptions: SelectOption[] = [
    { id: 'apartment', title: 'Căn hộ chung cư', description: 'An cư hoặc cho thuê tại TP.HCM & vùng lân cận', icon: 'building' },
    { id: 'house', title: 'Nhà phố / Biệt thự', description: 'Không gian rộng, phù hợp gia đình', icon: 'home' },
    { id: 'land', title: 'Đất nền', description: 'Tiềm năng tăng giá dài hạn', icon: 'land' },
    { id: 'undecided', title: 'Chưa xác định', description: 'Cần chuyên gia tư vấn thêm', icon: 'help' },
  ];

  readonly currentStepConfig = computed(() =>
    this.steps.find((s) => s.step === this.modal.currentStep()) ?? this.steps[0],
  );

  readonly currentOptions = computed(() => {
    switch (this.modal.currentStep()) {
      case 1:
        return this.purposeOptions;
      case 2:
        return this.budgetOptions;
      case 3:
        return this.needOptions;
      default:
        return [];
    }
  });

  readonly selectedValue = computed(() => {
    const data = this.modal.formData();
    switch (this.modal.currentStep()) {
      case 1:
        return data.purpose;
      case 2:
        return data.budget;
      case 3:
        return data.need;
      default:
        return '';
    }
  });

  readonly canContinue = computed(() => {
    const step = this.modal.currentStep();
    const data = this.modal.formData();
    if (step === 1) return !!data.purpose;
    if (step === 2) return !!data.budget;
    if (step === 3) return !!data.need;
    if (step === 4) return !!data.phone.trim();
    return false;
  });

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('qc-modal-backdrop')) {
      this.modal.close();
    }
  }

  selectOption(id: string): void {
    const step = this.modal.currentStep();
    if (step === 1) this.modal.setField('purpose', id);
    if (step === 2) this.modal.setField('budget', id);
    if (step === 3) this.modal.setField('need', id);
  }

  continue(): void {
    if (!this.canContinue()) return;
    if (this.modal.currentStep() === 4) {
      this.submit();
      return;
    }
    this.modal.nextStep();
  }

  back(): void {
    this.modal.prevStep();
  }

  submit(): void {
    // TODO: gửi API khi backend sẵn sàng
    console.log('Consultation submitted:', this.modal.formData());
    this.modal.close();
  }
}
