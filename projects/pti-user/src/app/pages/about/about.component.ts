import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BRAND } from '../../shared/brand';
import { ConsultationModalService } from '../consultation/consultation-modal.service';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  protected readonly brand = BRAND;
  protected readonly consultation = inject(ConsultationModalService);

  readonly stats = [
    { value: '10+', label: 'Năm kinh nghiệm' },
    { value: '6+', label: 'Dự án đang triển khai' },
    { value: '8,450+', label: 'Khách hàng tin tưởng' },
    { value: '4.9/5', label: 'Đánh giá hài lòng' },
  ];

  readonly values = [
    {
      title: 'Uy tín & Minh bạch',
      description: 'Cam kết thông tin rõ ràng, pháp lý đầy đủ trong mọi giao dịch bất động sản.',
      icon: 'shield',
    },
    {
      title: 'Tư vấn chuyên sâu',
      description: 'Đội ngũ chuyên gia am hiểu thị trường, đồng hành từ tư vấn đến bàn giao.',
      icon: 'people',
    },
    {
      title: 'Giải pháp toàn diện',
      description: 'Từ phân tích thị trường, chọn dự án đến công cụ tài chính – một nền tảng duy nhất.',
      icon: 'layers',
    },
    {
      title: 'Phát triển bền vững',
      description: 'Ưu tiên dự án có tiềm năng tăng trưởng dài hạn và hạ tầng phát triển.',
      icon: 'growth',
    },
  ];

  readonly milestones = [
    { year: '2014', text: 'Thành lập và bắt đầu hoạt động trong lĩnh vực bất động sản tại TP.HCM.' },
    { year: '2018', text: 'Mở rộng mạng lưới dự án sang Bình Dương, Đồng Nai và vùng ven.' },
    { year: '2022', text: 'Ra mắt nền tảng PTI HOME với công cụ phân tích và tư vấn đầu tư thông minh.' },
    { year: '2024', text: 'Phát triển danh mục đa dạng: căn hộ, đất nền, nhà phố và nghỉ dưỡng.' },
  ];

  readonly whyUs = [
    'Danh mục dự án được tuyển chọn kỹ lưỡng',
    'Dữ liệu thị trường cập nhật theo thời gian thực',
    'Hỗ trợ pháp lý và tài chính trọn gói',
    'Chăm sóc khách hàng 24/7',
  ];
}
