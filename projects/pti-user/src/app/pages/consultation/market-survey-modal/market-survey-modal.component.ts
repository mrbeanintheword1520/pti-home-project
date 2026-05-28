import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketSurveyModalService, MarketSurveyFormData } from '../market-survey-modal.service';
import { CustomerService } from '../../../shared/customer.service';

interface SurveyProject {
  id: string;
  name: string;
  location: string;
}

export interface DateOption {
  dayName: string;
  dateStr: string;
  fullStr: string;
}

export interface Expert {
  id: string;
  name: string;
  avatar: string;
  role: string;
  experience: string;
  specialty: string;
  clients: string;
  badge?: string;
  bio: string;
  phone: string;
}

@Component({
  selector: 'app-market-survey-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './market-survey-modal.component.html',
  styleUrl: './market-survey-modal.component.scss'
})
export class MarketSurveyModalComponent implements OnInit {
  protected readonly modal = inject(MarketSurveyModalService);
  protected readonly customerService = inject(CustomerService);

  readonly allProjects: SurveyProject[] = [
    { id: 'vinhomes-saigon-park', name: 'Vinhomes Saigon Park', location: 'TP. Hồ Chí Minh' },
    { id: 'vinhomes-grand-park', name: 'Vinhomes Grand Park', location: 'TP. Hồ Chí Minh' },
    { id: 'the-felix', name: 'Dự Án The Felix', location: 'Bình Dương' },
    { id: 'the-infinity-di-an', name: 'Dự Án The Infinity Dĩ An', location: 'Bình Dương' },
    { id: 'seahorse-central', name: 'The SeaHorse Central Bình Phước', location: 'Bình Phước' },
    { id: 'gold-coast-vung-tau', name: 'Gold Coast Vũng Tàu', location: 'Vũng Tàu' },
    { id: 'lan-anh-avenue', name: 'Lan Anh AVENUE', location: 'Bình Dương' },
    { id: 'gia-khai-luxury', name: 'Dự Án Gia Khải Luxury', location: 'Bình Dương' },
    { id: 'khanh-binh', name: 'Dự Án Khánh Bình', location: 'Bình Dương' },
  ];

  readonly regions = ['TP. Hồ Chí Minh', 'Bình Dương', 'Bình Phước', 'Vũng Tàu'];

  readonly budgetOptions = [
    { id: 'under-2', label: 'Dưới 2 tỷ' },
    { id: '2-5', label: '2 – 5 tỷ' },
    { id: '5-10', label: '5 – 10 tỷ' },
    { id: '10-20', label: '10 – 20 tỷ' },
    { id: 'over-20', label: 'Trên 20 tỷ' }
  ];

  readonly purposeOptions = [
    { id: 'invest', title: 'Đầu tư', icon: 'invest' },
    { id: 'live', title: 'Mua để ở', icon: 'home' },
    { id: 'rent', title: 'Cho thuê', icon: 'key' },
    { id: 'research', title: 'Tìm hiểu thị trường', icon: 'search' }
  ];

  readonly dates: DateOption[] = [];

  readonly timeSlots = [
    { id: 'morning-1', name: 'Sáng: 08:30 - 10:30' },
    { id: 'morning-2', name: 'Trưa: 11:00 - 13:00' },
    { id: 'afternoon-1', name: 'Chiều: 14:00 - 16:00' },
    { id: 'afternoon-2', name: 'Chiều tối: 16:30 - 18:30' },
    { id: 'evening', name: 'Tối: 19:00 - 21:00' }
  ];

  readonly experts: Expert[] = [
    {
      id: 'nguyen-hoang',
      name: 'Nguyễn Hoàng',
      avatar: 'https://ui-avatars.com/api/?name=Nguy%E1%BB%85n+Ho%C3%A0ng&background=972125&color=fff&rounded=true&size=120',
      role: 'Chuyên viên tư vấn cấp cao',
      experience: '8 năm kinh nghiệm',
      specialty: 'Chuyên khu vực TP. Thủ Đức',
      clients: 'Tư vấn 320+ khách hàng',
      badge: 'Phù hợp nhất',
      bio: 'Nguyễn Hoàng là chuyên viên tư vấn cao cấp tại PTI Home với hơn 8 năm am hiểu sâu sắc thị trường khu Đông TP.HCM, đặc biệt là dòng sản phẩm căn hộ và biệt thự Vinhomes.',
      phone: '0937 222 322'
    },
    {
      id: 'tran-minh-thu',
      name: 'Trần Minh Thư',
      avatar: 'https://ui-avatars.com/api/?name=Tr%E1%BA%A7n+Minh+Th%C6%B0&background=972125&color=fff&rounded=true&size=120',
      role: 'Chuyên viên tư vấn',
      experience: '5 năm kinh nghiệm',
      specialty: 'Chuyên phân khúc căn hộ cao cấp',
      clients: 'Tư vấn 180+ khách hàng',
      bio: 'Trần Minh Thư chuyên hỗ trợ khách hàng tìm kiếm căn hộ cao cấp để ở và đầu tư cho thuê sinh lời. Tận tâm, chu đáo và am hiểu pháp lý.',
      phone: '0938 111 222'
    },
    {
      id: 'tran-minh-nhu',
      name: 'Trần Minh Như',
      avatar: 'https://ui-avatars.com/api/?name=Tr%E1%BA%A7n+Minh+Nh%C6%B0&background=972125&color=fff&rounded=true&size=120',
      role: 'Chuyên viên phân tích đầu tư',
      experience: '6 năm kinh nghiệm',
      specialty: 'Chuyên căn hộ cao cấp và biệt thự',
      clients: 'Tư vấn 210+ khách hàng',
      bio: 'Trần Minh Như là chuyên gia phân tích dòng tiền và hỗ trợ khách hàng lựa chọn căn hộ có tiềm năng sinh lời cao nhất.',
      phone: '0938 999 888'
    },
    {
      id: 'le-quoc-bao',
      name: 'Lê Quốc Bảo',
      avatar: 'https://ui-avatars.com/api/?name=L%C3%AA+Qu%E1%BB%91c+B%E1%BA%A3o&background=972125&color=fff&rounded=true&size=120',
      role: 'Chuyên viên tư vấn',
      experience: '6 năm kinh nghiệm',
      specialty: 'Chuyên đầu tư và phân tích thị trường',
      clients: 'Tư vấn 250+ khách hàng',
      bio: 'Lê Quốc Bảo sở hữu nhãn quan đầu tư nhạy bén, chuyên phân tích dòng tiền và tiềm năng tăng giá của đất nền, nhà phố tại Bình Dương và Vũng Tàu.',
      phone: '0939 333 444'
    },
    {
      id: 'pham-thi-mai',
      name: 'Phạm Thị Mai',
      avatar: 'https://ui-avatars.com/api/?name=Ph%E1%BA%A1m+Th%E1%BB%8B+Mai&background=972125&color=fff&rounded=true&size=120',
      role: 'Chuyên viên tư vấn dự án',
      experience: '4 năm kinh nghiệm',
      specialty: 'Chuyên khu vực Vũng Tàu, Đồng Nai',
      clients: 'Tư vấn 120+ khách hàng',
      bio: 'Phạm Thị Mai là chuyên viên năng động, nhiệt huyết, am hiểu sâu sắc các dự án nghỉ dưỡng và bất động sản ven biển.',
      phone: '0935 444 555'
    },
    {
      id: 'pham-mai',
      name: 'Phạm Mại',
      avatar: 'https://ui-avatars.com/api/?name=Ph%E1%BA%A1m+M%E1%BA%A1i&background=972125&color=fff&rounded=true&size=120',
      role: 'Chuyên viên tư vấn đất nền và dự án',
      experience: '5 năm kinh nghiệm',
      specialty: 'Chuyên khu vực TP. Hồ Chí Minh và Bình Dương',
      clients: 'Tư vấn 140+ khách hàng',
      bio: 'Phạm Mại là chuyên viên tư vấn nhiệt tình, có kinh nghiệm đàm phán và hiểu biết rõ về quy hoạch các vùng kinh tế trọng điểm phía Nam.',
      phone: '0935 666 777'
    },
    {
      id: 'hoang-van-nam',
      name: 'Hoàng Văn Nam',
      avatar: 'https://ui-avatars.com/api/?name=Ho%C3%A0ng+V%C4%83n+Nam&background=972125&color=fff&rounded=true&size=120',
      role: 'Chuyên viên tư vấn đất nền',
      experience: '7 năm kinh nghiệm',
      specialty: 'Chuyên khu vực Bình Dương, Bình Phước',
      clients: 'Tư vấn 290+ khách hàng',
      bio: 'Hoàng Văn Nam am hiểu sâu các khu công nghiệp, đất nền dự án phân lô và pháp lý hoàn thiện tại Bình Dương.',
      phone: '0936 555 666'
    }
  ];

  selectedProfileExpert = signal<Expert | null>(null);

  ngOnInit(): void {
    this.generateDates();
  }

  generateDates(): void {
    const weekdays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      
      const dayName = i === 0 ? "Hôm nay" : weekdays[nextDate.getDay()];
      const dd = String(nextDate.getDate()).padStart(2, '0');
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dateStr = `${dd}/${mm}`;
      const fullStr = `${dayName}, ${dd}/${mm}/${nextDate.getFullYear()}`;
      
      this.dates.push({
        dayName,
        dateStr,
        fullStr
      });
    }
  }

  readonly filteredProjects = computed(() => {
    const selectedRegion = this.modal.formData().area;
    if (!selectedRegion) {
      return this.allProjects;
    }
    return this.allProjects.filter(p => p.location === selectedRegion);
  });

  onRegionChange(event: Event): void {
    const region = (event.target as HTMLSelectElement).value;
    this.modal.setField('area', region);
    
    // Nếu dự án đã chọn không thuộc khu vực mới chọn, reset dự án
    const currentProject = this.modal.formData().project;
    if (currentProject) {
      const projObj = this.allProjects.find(p => p.name === currentProject);
      if (projObj && projObj.location !== region) {
        this.modal.setField('project', '');
      }
    }
  }

  onProjectChange(event: Event): void {
    const projectName = (event.target as HTMLSelectElement).value;
    this.modal.setField('project', projectName);
    if (projectName) {
      const projObj = this.allProjects.find(p => p.name === projectName);
      if (projObj) {
        this.modal.setField('area', projObj.location);
      }
    }
  }

  selectPurpose(id: string): void {
    this.modal.setField('purpose', id);
  }

  selectDate(fullStr: string): void {
    this.modal.setField('date', fullStr);
  }

  selectTimeSlot(timeStr: string): void {
    this.modal.setField('timeSlot', timeStr);
  }

  selectExpert(expertId: string): void {
    this.modal.setField('selectedExpertId', expertId);
  }

  showExpertProfile(expert: Expert, event: Event): void {
    event.stopPropagation();
    this.selectedProfileExpert.set(expert);
  }

  closeExpertProfile(): void {
    this.selectedProfileExpert.set(null);
  }

  getSelectedExpert(): Expert {
    const expertId = this.modal.formData().selectedExpertId;
    return this.experts.find(e => e.id === expertId) || this.experts[0];
  }

  readonly canContinue = computed(() => {
    const step = this.modal.currentStep();
    const data = this.modal.formData();
    
    if (step === 1) {
      return (
        !!data.area &&
        !!data.purpose &&
        !!data.budget &&
        !!data.name.trim() &&
        !!data.phone.trim()
      );
    }
    if (step === 2) {
      return !!data.date && !!data.timeSlot;
    }
    if (step === 3) {
      return !!data.selectedExpertId;
    }
    return true;
  });

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('ms-modal-backdrop')) {
      this.modal.close();
    }
  }

  getMissingFields(step: number): string[] {
    const data = this.modal.formData();
    const missing: string[] = [];
    if (step === 1) {
      if (!data.name || !data.name.trim()) missing.push('Họ và tên');
      if (!data.phone || !data.phone.trim()) missing.push('Số điện thoại');
      if (!data.area) missing.push('Khu vực quan tâm');
      if (!data.project) missing.push('Dự án quan tâm');
      if (!data.purpose) missing.push('Mục đích đầu tư (Nhu cầu)');
      if (!data.budget) missing.push('Khoảng giá (Số tiền)');
    } else if (step === 2) {
      if (!data.date) missing.push('Ngày hẹn');
      if (!data.timeSlot) missing.push('Giờ hẹn (Khung giờ)');
    } else if (step === 3) {
      if (!data.selectedExpertId) missing.push('Chuyên viên tư vấn');
    }
    return missing;
  }

  continue(): void {
    const step = this.modal.currentStep();
    const missing = this.getMissingFields(step);
    if (missing.length > 0) {
      alert('Vui lòng bổ sung đầy đủ các thông tin sau:\n- ' + missing.join('\n- '));
      return;
    }

    if (step === 1) {
      const data = this.modal.formData();
      const phone = data.phone.trim();
      const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        alert('Số điện thoại không hợp lệ!');
        return;
      }
      if (data.email && data.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email.trim())) {
          alert('Email không hợp lệ!');
          return;
        }
      }
    }

    if (step === 2) {
      const data = this.modal.formData();
      const existingApps = this.customerService.customer()?.appointments || [];
      const overlap = existingApps.find(a => a.appointmentDate === data.date && a.appointmentTime === data.timeSlot);
      if (overlap) {
        alert(`Trùng lịch hẹn! Bạn đã đặt lịch khảo sát dự án "${overlap.project}" vào thời gian này (${data.date} - ${data.timeSlot}). Vui lòng chọn thời gian khác.`);
        return;
      }
    }

    if (step === 4) {
      const data = this.modal.formData();

      const agentMap: { [key: string]: string } = {
        'nguyen-hoang': 'Nguyễn Hoàng',
        'tran-minh-thu': 'Trần Minh Thư',
        'tran-minh-nhu': 'Trần Minh Như',
        'le-quoc-bao': 'Lê Quốc Bảo',
        'pham-thi-mai': 'Phạm Thị Mai',
        'pham-mai': 'Phạm Mại',
        'hoang-van-nam': 'Hoàng Văn Nam'
      };

      const purposeMap: { [key: string]: string } = {
        'invest': 'Đầu tư',
        'live': 'Mua để ở',
        'rent': 'Cho thuê',
        'research': 'Khảo sát thị trường'
      };

      const budgetMap: { [key: string]: string } = {
        'under-2': 'Dưới 2 tỷ',
        '2-5': '2 - 5 tỷ',
        '5-10': '5 - 10 tỷ',
        '10-20': '10 - 20 tỷ',
        'over-20': 'Trên 20 tỷ'
      };

      this.customerService.saveCustomer({
        phone: data.phone,
        name: data.name,
        email: data.email,
        interest: data.project,
        area: data.area,
        budget: budgetMap[data.budget] || data.budget || 'Chưa chọn',
        behavior: `Khảo sát: Nhu cầu ${purposeMap[data.purpose] || 'Đầu tư'}. Ghi chú: ${data.specialNeed || 'Không có'}`,
        agent: agentMap[data.selectedExpertId] || 'Nguyễn Hoàng',
        source: 'Zalo',
        note: data.specialNeed,
        appointmentDate: data.date,
        appointmentTime: data.timeSlot
      });

      this.modal.nextStep(); // Chuyển sang màn hình thành công (Step 5)
      return;
    }
    this.modal.nextStep();
  }

  back(): void {
    this.modal.prevStep();
  }

  finish(): void {
    this.modal.close();
  }
}
