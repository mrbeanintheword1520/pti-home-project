import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketSurveyModalService } from '../consultation/market-survey-modal.service';
import { ConsultationModalService } from '../consultation/consultation-modal.service';

interface ZoneDetail {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  highlights: string[];
  specs: { label: string; value: string }[];
}

interface Zone {
  id: number;
  name: string;
  color: string;
  units: string;
  products: string[];
  priceRange: string;
  areaRange: string;
  status: string;
  mapX: string; // top percentage
  mapY: string; // left percentage
  polygonPoints: string;
  details: ZoneDetail;
}

@Component({
  selector: 'app-project-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-map.component.html',
  styleUrl: './project-map.component.scss'
})
export class ProjectMapComponent {
  private readonly surveyModalService = inject(MarketSurveyModalService);
  private readonly consultModalService = inject(ConsultationModalService);
  activeZone = signal<number | null>(2); // Mặc định chọn Global Park (id = 2)
  isConsultDropdownOpen = signal<boolean>(false);
  phone = '';
  searchQuery = '';
  selectedType = 'Tất cả loại hình';
  priceRangeValue = 45; // Giá cao nhất 45 tỷ
  areaRangeValue = 250; // Diện tích lớn nhất 250 m2
  selectedDirection = 'Tất cả hướng';
  selectedStatus = 'Tất cả';

  // Modal signals
  isDetailModalOpen = signal<boolean>(false);
  activeModalImageIndex = signal<number>(0);

  // Dữ liệu các phân khu thực tế từ Vinhomes Saigon Park (Hóc Môn)
  zones: Zone[] = [
    {
      id: 1,
      name: 'Ivy Park',
      color: '#8B5CF6', // Tím
      units: 'Nhà liền kề thấp tầng',
      products: ['Nhà liền kề', 'Nhà phố', 'Biệt thự'],
      priceRange: '5.2 - 9.8 tỷ',
      areaRange: '56 - 200 m²',
      status: 'Sắp mở bán',
      mapX: '33.3%',
      mapY: '34.2%',
      polygonPoints: '118,596 157,577 581,218 766,270 776,258 808,267 802,280 878,306 903,304 880,338 822,329 384,567',
      details: {
        title: 'Công viên Tri thức – Ivy Park',
        subtitle: 'Phân khu giáo dục, học thuật & đổi mới sáng tạo lớn nhất đại đô thị',
        description: 'Lấy cảm hứng từ tinh thần học thuật đỉnh cao của Boston – Cambridge (Mỹ), Ivy Park được quy hoạch như một trung tâm giáo dục đa chức năng kết hợp không gian sống, thương mại và sáng tạo. Đây là nơi học tập, nghiên cứu và sinh hoạt của hàng chục nghìn giảng viên, sinh viên quốc tế và chuyên gia, mở ra tiềm năng khai thác dòng tiền và tăng giá bền vững.',
        images: [
          'images/phankhu/ivy-villa.jpg',
          'images/phankhu/ivy-shophouse.jpg',
          'images/phankhu/ivy-interior.jpg'
        ],
        highlights: [
          '🏫 Quần thể giáo dục đại học đa ngành rộng 150ha',
          '🚇 Nằm ngay sát nút giao Vành đai 3 & Ga Metro số 2',
          '🛍️ Liền kề TTTM Vincom Mega Mall (4.6ha) & Bệnh viện Vinmec (6.9ha)',
          '🌳 Hệ sinh thái Walkable City với 16km đường xe đạp & 5km Canal Park',
          '🏠 Số lượng nhà liền kề thấp tầng quy mô lớn nhất dự án'
        ],
        specs: [
          { label: 'Vị trí phân khu', value: 'Cửa ngõ dự án, giáp đường Tam Tân & Thanh Niên, Hóc Môn' },
          { label: 'Chủ đầu tư', value: 'Tập đoàn Vingroup' },
          { label: 'Quy mô cộng đồng', value: 'Khoảng 60.000 sinh viên, giảng viên & chuyên gia' },
          { label: 'Loại hình sản phẩm', value: 'Nhà liền kề, Shophouse bổ trợ giáo dục, F&B' },
          { label: 'Tên đường nội khu', value: 'Đường Khát Vọng, Thịnh Vượng, Tri Thức, Tinh Hoa, Thời Đại' }
        ]
      }
    },
    {
      id: 2,
      name: 'Global Park',
      color: '#F97316', // Cam
      units: 'Sản phẩm 100% thấp tầng',
      products: ['Nhà liền kề', 'Biệt thự song lập'],
      priceRange: '6.0 - 15.5 tỷ',
      areaRange: '60 - 150 m²',
      status: 'Đang mở bán',
      mapX: '42.7%',
      mapY: '38.2%',
      polygonPoints: '398,566 712,532 853,528 878,345 824,335',
      details: {
        title: 'Công viên Quốc tế – Global Park',
        subtitle: 'Trái tim giao thương sầm uất & Hệ sinh thái Lifestyle 24/7 sôi động nhất đại đô thị',
        description: 'Lấy cảm hứng từ sự phồn hoa và năng động của trung tâm tài chính – giải trí Canary Wharf (London), Global Park được định vị trở thành một "Downtown quốc tế" sầm uất hoạt động xuyên ngày đêm. Đây là phân khu thấp tầng mở độc đáo, tối ưu cho các hoạt động thương mại dịch vụ, F&B, kinh tế đêm, đón đầu nguồn chi tiêu khổng lồ của cư dân và hàng vạn chuyên gia chất lượng cao từ KCN Tân Phú Trung kề cận.',
        images: [
          'images/phankhu/global-layout.jpg',
          'images/phankhu/global-village.png',
          'images/phankhu/little-hongkong.png'
        ],
        highlights: [
          '🌐 Làng văn hóa & ẩm thực quốc tế Global Village rộng 19.3ha hoạt động 24/7',
          '🏮 Phố giải trí, ẩm thực & kinh tế đêm Little Hong Kong rộng 7.5ha phong cách cảng thơm',
          '🛍️ Tổ hợp mua sắm cao cấp Vincom Collection 6.5ha & Làng thời trang Saigon Town 2.3ha',
          '🌌 Bộ đôi Công viên thiên văn Galaxy Park (~3.9ha) & Công viên tri thức Ivy Park (~3.3ha)',
          '🏢 100% sản phẩm thấp tầng thương mại, tối ưu cho thuê và dòng tiền thực bền vững'
        ],
        specs: [
          { label: 'Vị trí phân khu', value: 'Cửa ngõ dự án, giáp trục đường Tam Tân & Kênh Xáng, Hóc Môn' },
          { label: 'Chủ đầu tư', value: 'Tập đoàn Vingroup' },
          { label: 'Trục đường nội khu', value: 'Đường Quốc Tế, Hội Nhập, Thịnh Vượng, Tri Thức, Khát Vọng, Tinh Hoa, Gió Biển' },
          { label: 'Loại hình sản phẩm', value: 'Nhà liền kề, Biệt thự song lập cao cấp' },
          { label: 'Kết nối hạ tầng', value: 'Ga Metro số 2 (5-7 phút), Nút giao Vành đai 3 (10 phút)' }
        ]
      }
    },
    {
      id: 3,
      name: 'Laguna Park',
      color: '#EC4899', // Hồng
      units: '15 tháp căn hộ & thấp tầng',
      products: ['Căn hộ', 'Nhà phố', 'Biệt thự'],
      priceRange: '1.8 - 18.5 tỷ',
      areaRange: '30 - 220 m²',
      status: 'Sắp mở bán',
      mapX: '38.8%',
      mapY: '56.5%',
      polygonPoints: '863,526 1295,537 1273,415 1278,400 912,300 885,339',
      details: {
        title: 'Công viên Biển xanh – Laguna Park',
        subtitle: 'Không gian sống phong cách resort Địa Trung Hải bên kênh sinh thái',
        description: 'Lấy cảm hứng từ thành phố biển Barcelona (Tây Ban Nha), Laguna Park mang đến trải nghiệm sống đậm chất nghỉ dưỡng với các tòa căn hộ cao cấp và dãy nhà phố ven kênh. Hệ sinh thái tiện ích nước độc đáo giúp cư dân tận hưởng kỳ nghỉ trọn vẹn mỗi ngày.',
        images: [
          'assets/images/lumiere_boulevard.png',
          'assets/images/masteri_centre_point.png'
        ],
        highlights: [
          '🌊 Phong cách thiết kế Địa Trung Hải - Barcelona tươi mát',
          '⛵ Hệ thống bến thuyền và kênh sinh thái bao quanh',
          '🏊 Hồ bơi tràn bờ kết hợp công viên nước mini cho trẻ em',
          '🏢 Quần thể 15 tòa căn hộ cao cấp & biệt thự ven sông'
        ],
        specs: [
          { label: 'Vị trí phân khu', value: 'Phía Đông dự án, dọc sông sinh thái' },
          { label: 'Chủ đầu tư', value: 'Tập đoàn Vingroup' },
          { label: 'Tiện ích nổi bật', value: 'Bến thuyền, công viên ven sông, bể bơi tràn' },
          { label: 'Loại hình sản phẩm', value: 'Căn hộ cao cấp, Shophouse khối đế, Biệt thự ven sông' }
        ]
      }
    },
    {
      id: 4,
      name: 'Zen Park',
      color: '#10B981', // Xanh lá
      units: 'Biệt thự & thấp tầng biệt lập',
      products: ['Nhà liền kề', 'Biệt thự song lập', 'Biệt thự đơn lập'],
      priceRange: '8.5 - 25.0 tỷ',
      areaRange: '80 - 220 m²',
      status: 'Sắp mở bán',
      mapX: '44.1%',
      mapY: '74.3%',
      polygonPoints: '1283,401 1838,550 1304,537 1278,415',
      details: {
        title: 'Công viên Thiền – Zen Park',
        subtitle: 'Thủ phủ chữa lành & Không gian sống Wellness chuẩn resort Nhật Bản',
        description: 'Lấy cảm hứng từ thị trấn nghỉ dưỡng danh tiếng Karuizawa (Nhật Bản), Zen Park được kiến tạo như một "Wellness living" đích thực và "đảo trong lòng đảo" riêng tư, tĩnh tại. Nơi đây sở hữu mật độ cây xanh và mặt nước bao phủ vượt trội mang lại không gian thiền định yên bình, giúp phục hồi và cân bằng Thân – Tâm – Trí cho cộng đồng cư dân tinh hoa.',
        images: [
          'images/phankhu/zen-layout.jpg',
          'images/phankhu/zen-aerial.jpg',
          'images/phankhu/zen-pond.jpg',
          'images/phankhu/zen-gate.jpg'
        ],
        highlights: [
          '🌸 Công viên Nhật Bản Kiyomi Park quy mô lớn 10ha đậm chất thiền tĩnh tại',
          '🏮 Làng cổ văn hóa & ẩm thực Nhật Bản rộng 1.5ha trải nghiệm tinh hoa đa giác quan',
          '🛒 Chợ đô thị Urban Market 1ha (quy hoạch đến 11ha) tiện lợi mua sắm mỗi ngày',
          '🎾 Cụm hơn 150 sân thể thao (tennis, padel, pickleball) lớn nhất miền Nam',
          '🏡 Sản phẩm biệt thự quy mô lớn nhất dự án: Song lập, Đơn lập compound khép kín'
        ],
        specs: [
          { label: 'Vị trí phân khu', value: 'Liền kề Laguna Park & Sân Golf, giáp đường Tam Tân, Hóc Môn' },
          { label: 'Chủ đầu tư', value: 'Tập đoàn Vingroup' },
          { label: 'Quy hoạch hạ tầng', value: 'Khu căn hộ cao cấp biệt lập kết hợp Biệt thự thấp tầng nghỉ dưỡng' },
          { label: 'Tiện ích đặc trưng', value: 'Kiyomi Park (10ha), Làng Nhật Bản (1.5ha), Urban Market, hồ cá Koi, cổng trời Torii' },
          { label: 'Phong cách thiết kế', value: 'Lấy cảm hứng từ thị trấn Karuizawa, Nhật Bản (Tĩnh tại & Chữa lành)' }
        ]
      }
    },
    {
      id: 5,
      name: 'Golf Park',
      color: '#3B82F6', // Xanh dương
      units: 'Biệt thự & liền kề compound',
      products: ['Nhà liền kề', 'Biệt thự song lập', 'Biệt thự đơn lập'],
      priceRange: '15.0 - 45.0 tỷ',
      areaRange: '120 - 250 m²',
      status: 'Sắp mở bán',
      mapX: '61.1%',
      mapY: '85.7%',
      polygonPoints: '1304,547 1782,556 1796,559 1806,566 1818,578 1821,600 1833,673 1879,959 1673,897 1573,671 1416,663 1356,649 1327,654',
      details: {
        title: 'Công viên Golf – Golf Park',
        subtitle: 'Khu biệt thự sân Golf nghỉ dưỡng thượng lưu phong cách Palm Beach',
        description: 'Quy hoạch theo mô hình "Golf Resort Integrated City", Golf Park mang đến không gian sống compound biệt lập, khép kín hoàn toàn và riêng tư tuyệt đối cho giới tinh hoa. Ôm trọn trái tim của phân khu là sân golf 36 hố Vinpearl Golf Léman quy mô 200ha và thảm cỏ xanh mướt, mang lại tầm nhìn panorama triệu đô không giới hạn.',
        images: [
          'images/phankhu/golf-layout.jpg',
          'images/phankhu/golf-field1.png',
          'images/phankhu/golf-field2.png',
          'images/phankhu/golf-sunset.png'
        ],
        highlights: [
          '⛳ Sân golf Vinpearl Golf Léman 36 hố quy mô 200ha tiêu chuẩn quốc tế',
          '🏛️ Convention Hall - Trung tâm hội nghị quốc tế sang trọng sức chứa 700 chỗ',
          '🏖️ Clubhouse nghỉ dưỡng chuẩn resort 5 sao cùng bể bơi tràn bờ và Lounge Cigar',
          '🛡️ An ninh Compound biệt lập đa lớp, kiểm soát ra vào bằng công nghệ AI 24/7',
          '🏡 Dòng sản phẩm biệt thự đơn lập, song lập phong cách Palm Beach (Florida, Mỹ) sang trọng'
        ],
        specs: [
          { label: 'Vị trí phân khu', value: 'Xã Xuân Thới Sơn, Hóc Môn, giáp đường Tam Tân & Kênh Xáng' },
          { label: 'Chủ đầu tư', value: 'Tập đoàn Vingroup' },
          { label: 'Quy hoạch hạ tầng', value: 'Khu biệt thự nghỉ dưỡng Compound kết hợp sân golf 200ha' },
          { label: 'Tiện ích đặc trưng', value: 'Vinpearl Golf Léman 36 hố, Convention Hall, VIP Clubhouse, hồ cảnh quan sinh thái' },
          { label: 'Phong cách thiết kế', value: 'Lấy cảm hứng từ thiên đường thượng lưu Palm Beach, Florida, Mỹ' }
        ]
      }
    }
  ];

  selectZone(id: number) {
    this.activeZone.set(id);
  }

  onMapClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Chỉ xử lý click nếu click trực tiếp vào ảnh map hoặc container của map
    if (!target.classList.contains('map-image') && !target.classList.contains('map-inner')) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const clickX = ((event.clientX - rect.left) / rect.width) * 100;
    const clickY = ((event.clientY - rect.top) / rect.height) * 100;

    // Tìm phân khu có khoảng cách gần nhất
    let closestZone: Zone | null = null;
    let minDistance = Infinity;

    for (const zone of this.zones) {
      // mapY là left (X), mapX là top (Y)
      const zoneX = parseFloat(zone.mapY);
      const zoneY = parseFloat(zone.mapX);
      
      const distance = Math.sqrt(Math.pow(clickX - zoneX, 2) + Math.pow(clickY - zoneY, 2));
      if (distance < minDistance) {
        minDistance = distance;
        closestZone = zone;
      }
    }

    // Nếu khoảng cách đủ gần (ví dụ < 20% chiều rộng/cao bản đồ)
    if (closestZone && minDistance < 20) {
      this.selectZone(closestZone.id);
    }
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.isConsultDropdownOpen.set(false);
  }

  toggleConsultDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isConsultDropdownOpen.update(v => !v);
  }

  selectConsultOption(option: string, event: MouseEvent) {
    event.stopPropagation();
    this.isConsultDropdownOpen.set(false);
    
    const optLower = option.toLowerCase();
    if (optLower.includes('bảng giá')) {
      this.surveyModalService.open('Vinhomes Saigon Park');
      this.surveyModalService.setField('specialNeed', option);
      this.surveyModalService.setField('purpose', 'invest');
    } else {
      this.consultModalService.open();
      if (optLower.includes('tham quan')) {
        this.consultModalService.setField('purpose', 'live');
        this.consultModalService.setField('need', 'apartment');
        this.consultModalService.setField('note', 'Đăng ký tham quan nhà mẫu Vinhomes Saigon Park');
      } else if (optLower.includes('tài chính')) {
        this.consultModalService.setField('purpose', 'invest');
        this.consultModalService.setField('note', 'Tư vấn tài chính & vay vốn Vinhomes Saigon Park');
      } else if (optLower.includes('phong thủy')) {
        this.consultModalService.setField('need', 'undecided');
        this.consultModalService.setField('note', 'Chọn căn đẹp phong thủy Vinhomes Saigon Park');
      } else {
        this.consultModalService.setField('note', option);
      }
    }
  }

  openSurveyModal() {
    this.surveyModalService.open('Vinhomes Saigon Park');
    this.surveyModalService.setField('specialNeed', 'Nhận bảng giá');
    this.surveyModalService.setField('purpose', 'invest');
  }

  submit() {
    if (!this.phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }
    alert(`Đã gửi yêu cầu tư vấn cho Vinhomes Saigon Park: ${this.phone}`);
    this.phone = '';
  }

  openDetailModal() {
    this.activeModalImageIndex.set(0);
    this.isDetailModalOpen.set(true);
  }

  closeDetailModal() {
    this.isDetailModalOpen.set(false);
  }

  setModalImage(index: number) {
    this.activeModalImageIndex.set(index);
  }

  prevModalImage(length: number) {
    const current = this.activeModalImageIndex();
    this.activeModalImageIndex.set(current === 0 ? length - 1 : current - 1);
  }

  nextModalImage(length: number) {
    const current = this.activeModalImageIndex();
    this.activeModalImageIndex.set(current === length - 1 ? 0 : current + 1);
  }
}

