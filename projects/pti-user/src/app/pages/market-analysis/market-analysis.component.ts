import { Component, OnInit, OnDestroy, HostListener, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-market-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './market-analysis.component.html',
  styleUrl: './market-analysis.component.scss'
})
export class MarketAnalysisComponent implements OnInit, OnDestroy {
  currentTime: Date = new Date();
  private timerId: any;
  isBannerHidden = false;
  lastScrollTop = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initCharts();

      import('leaflet').then(L => {
        // Need to require leaflet.heat dynamically as well, but it relies on L globally.
        // A safer way is to assign it to window before requiring
        (window as any).L = L;
        import('leaflet.heat').then(() => {
          const map = L.map('marketMap').setView([10.89, 106.59], 12);

          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
          }).addTo(map);

          const heatData: [number, number, number][] = [];

          // Generate 350 points heavily clustered in Hoc Mon
          for (let i = 0; i < 350; i++) {
            const lat = 10.89 + (Math.random() - 0.5) * 0.08;
            const lng = 106.59 + (Math.random() - 0.5) * 0.08;
            heatData.push([lat, lng, 0.3]);
          }

          // Generate 150 points in Cu Chi (northwest of Hoc Mon)
          for (let i = 0; i < 150; i++) {
            const lat = 10.95 + (Math.random() - 0.5) * 0.1;
            const lng = 106.51 + (Math.random() - 0.5) * 0.1;
            heatData.push([lat, lng, 0.2]);
          }

          // Generate 150 points in District 12 (southeast of Hoc Mon)
          for (let i = 0; i < 150; i++) {
            const lat = 10.86 + (Math.random() - 0.5) * 0.06;
            const lng = 106.64 + (Math.random() - 0.5) * 0.06;
            heatData.push([lat, lng, 0.25]);
          }

          (L as any).heatLayer(heatData, {
            radius: 40,
            blur: 50,
            maxZoom: 14,
            max: 5.0, // increased max to make the heat look lighter/softer
            gradient: {
              0.4: '#ffeb3b', // yellow
              0.6: '#ffb300', // amber
              0.8: '#fb8c00', // orange
              1.0: '#e65100'  // dark orange
            }
          }).addTo(map);
        });
      });
    }
  }

  initCharts() {
    Chart.defaults.font.family = "'Montserrat', sans-serif";
    const labels = ['20/04', '27/04', '04/05', '11/05', '18/05', '25/05', '01/06'];

    // Price Chart
    new Chart('priceChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: 'TP. Thủ Đức', data: [50, 75, 105, 95, 120, 135, 150], borderColor: '#f5222d', backgroundColor: '#f5222d', tension: 0.1 },
          { label: 'Quận 7', data: [40, 60, 80, 90, 105, 120, 125], borderColor: '#fa8c16', backgroundColor: '#fa8c16', tension: 0.1 },
          { label: 'Bình Chánh', data: [30, 45, 65, 75, 90, 95, 105], borderColor: '#52c41a', backgroundColor: '#52c41a', tension: 0.1 },
          { label: 'Nhà Bè', data: [20, 30, 50, 60, 70, 80, 85], borderColor: '#1890ff', backgroundColor: '#1890ff', tension: 0.1 },
          { label: 'Dĩ An', data: [15, 20, 30, 40, 45, 55, 60], borderColor: '#722ed1', backgroundColor: '#722ed1', tension: 0.1 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { grid: { display: false } },
          y: { min: 0, max: 160 }
        }
      }
    });

    // Views Chart
    const ctx = document.getElementById('viewsChart') as HTMLCanvasElement;
    if (ctx) {
      const gradient = ctx.getContext('2d')?.createLinearGradient(0, 0, 0, 220);
      if (gradient) {
        gradient.addColorStop(0, 'rgba(82, 196, 26, 0.4)');
        gradient.addColorStop(1, 'rgba(82, 196, 26, 0.0)');
      }
      new Chart('viewsChart', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Lượt quan tâm',
            data: [60000, 45000, 90000, 75000, 130000, 110000, 170000, 150000], // Example data matching the path shape
            borderColor: '#52c41a',
            backgroundColor: gradient || 'rgba(82, 196, 26, 0.2)',
            fill: true,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
          scales: {
            x: { grid: { display: false } },
            y: { min: 0, grid: { display: false } }
          }
        }
      });
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.lastScrollTop && st > 100) {
      // Downscroll -> Hide banner
      this.isBannerHidden = true;
    } else {
      // Upscroll -> Show banner
      this.isBannerHidden = false;
    }
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  ngOnInit() {
    this.timerId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  tabs = [
    { id: 'tong-quan', label: 'Tổng quan thị trường', active: true },
    { id: 'bien-dong-gia', label: 'Biến động giá', active: false },
    { id: 'ha-tang', label: 'Hạ tầng & Quy hoạch', active: false },
    { id: 'luong-quan-tam', label: 'Lượng quan tâm', active: false },
    { id: 'bao-cao', label: 'Báo cáo thị trường', active: false }
  ];

  fastestGrowingAreas = [
    { rank: 1, name: 'Hóc Môn', growth: '+18.7%', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=50&h=50&fit=crop' },
    { rank: 2, name: 'Quận 7', growth: '+15.3%', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=50&h=50&fit=crop' },
    { rank: 3, name: 'Bình Chánh', growth: '+12.1%', img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=50&h=50&fit=crop' },
    { rank: 4, name: 'Dĩ An (Bình Dương)', growth: '+9.8%', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=50&h=50&fit=crop' },
    { rank: 5, name: 'Nhơn Trạch (Đồng Nai)', growth: '+8.7%', img: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=50&h=50&fit=crop' }
  ];

  topProjects = [
    {
      name: 'Vinhomes Saigon Park',
      location: 'Tân Thới Nhì, huyện Hóc Môn, TP.HCM',
      shortLoc: 'Hóc Môn',
      views: '12,456',
      growth: '+18.7%',
      img: '/assets/images/vinhomes.png',
      desc: 'Đại đô thị quy mô lớn của Vinhomes tại cửa ngõ Tây Bắc TP.HCM, hưởng lợi từ Quốc lộ 22, Vành đai 3 và cao tốc TP.HCM – Mộc Bài.<br><br>Dự án hứa hẹn trở thành tâm điểm an cư và đầu tư mới với quy hoạch đồng bộ, công viên sinh thái khổng lồ, và hệ sinh thái tiện ích All-in-one mang thương hiệu Vingroup. Đặc biệt, phân khu mở bán đợt đầu tiên đang nhận được sự quan tâm kỷ lục nhờ chính sách thanh toán linh hoạt và tiềm năng tăng giá mạnh mẽ khi hạ tầng giao thông khu vực hoàn thiện vào năm 2025.<br><br>Ngoài lợi thế vị trí chiến lược, dự án còn được đánh giá cao nhờ mật độ xây dựng thấp và định hướng phát triển đô thị xanh hiện đại. Với quy mô quy hoạch bài bản cùng tốc độ phát triển hạ tầng khu Tây Bắc, khu vực này đang dần trở thành điểm đến mới của giới đầu tư và cư dân trẻ tại TP.HCM.'
    },
    {
      name: 'The Beverly Solari',
      location: 'Vinhomes Grand Park, TP. Thủ Đức',
      shortLoc: 'Thủ Đức',
      views: '8,921',
      growth: '+16.3%',
      img: '/assets/images/bevery_solari.png',
      desc: 'Phân khu căn hộ cao cấp trong Vinhomes Grand Park, nổi bật với phong cách sống nghỉ dưỡng và hệ tiện ích nội khu hiện đại.'
    },
    {
      name: 'Lumière Boulevard',
      location: 'Vinhomes Grand Park, TP. Thủ Đức',
      shortLoc: 'Thủ Đức',
      views: '7,654',
      growth: '+15.8%',
      img: '/assets/images/lumiere_boulevard.png',
      desc: 'Dự án căn hộ cao cấp của Masterise Homes, nổi bật với concept sống xanh, nhiều mảng xanh và tiện ích compound.'
    },
    {
      name: 'Masteri Centre Point',
      location: 'Vinhomes Grand Park, TP. Thủ Đức',
      shortLoc: 'Thủ Đức',
      views: '6,432',
      growth: '+14.2%',
      img: '/assets/images/masteri_centre_point.png',
      desc: 'Khu căn hộ cao cấp nằm trong đại đô thị Grand Park, định vị theo phong cách sống hiện đại, tiện nghi và kết nối tốt trong khu Đông.'
    },
    {
      name: 'The Global City',
      location: 'Đường Đỗ Xuân Hợp, phường An Phú, TP. Thủ Đức',
      shortLoc: 'Thủ Đức',
      views: '5,678',
      growth: '+13.1%',
      img: '/assets/images/the _global_city.png',
      desc: 'Khu đô thị hạng sang của Masterise Homes, được định hướng thành “downtown mới” với nhà phố, căn hộ, tiện ích thương mại và quảng trường nhạc nước.'
    }
  ];

  potentialRanking = [
    { rank: 1, name: 'Hóc Môn', potential: 92, heat: 78, priceGrowth: '+18.7%' },
    { rank: 2, name: 'Quận 7', potential: 88, heat: 72, priceGrowth: '+15.3%' },
    { rank: 3, name: 'Bình Chánh', potential: 85, heat: 65, priceGrowth: '+12.1%' },
    { rank: 4, name: 'Dĩ An (Bình Dương)', potential: 82, heat: 60, priceGrowth: '+9.8%' },
    { rank: 5, name: 'Nhơn Trạch (Đồng Nai)', potential: 80, heat: 58, priceGrowth: '+8.7%' }
  ];

  selectTab(tabId: string) {
    this.tabs.forEach(t => t.active = t.id === tabId);
  }

  // Modal logic
  selectedProject: any = null;
  showFormOnly: boolean = false;
  phoneNumber: string = '';
  isSubmitted: boolean = false;

  openProjectModal(project: any, formOnly: boolean = false) {
    this.selectedProject = project;
    this.showFormOnly = formOnly;
    this.phoneNumber = '';
    this.isSubmitted = false;
  }

  closeProjectModal() {
    this.selectedProject = null;
  }

  submitConsultation() {
    if (this.phoneNumber && this.phoneNumber.trim().length > 8) {
      this.isSubmitted = true;
      setTimeout(() => {
        this.closeProjectModal();
      }, 3000);
    } else {
      alert('Vui lòng nhập số điện thoại hợp lệ (lớn hơn 8 số).');
    }
  }
}
