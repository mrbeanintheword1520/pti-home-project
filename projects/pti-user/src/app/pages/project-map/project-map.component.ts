import { Component, inject, signal, computed, effect, HostListener, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../shared/customer.service';
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
export class ProjectMapComponent implements OnInit, OnDestroy {
  private readonly surveyModalService = inject(MarketSurveyModalService);
  private readonly consultModalService = inject(ConsultationModalService);
  private readonly route = inject(ActivatedRoute);
  private readonly customerService = inject(CustomerService);

  private intervalId: any;
  private currentTrackedProject = '';
  private entryTime = 0;
  private lastLoggedDuration = 0;

  activeZone = signal<number | null>(2); // Mặc định chọn Global Park (id = 2)
  isConsultantExpanded = signal<boolean>(false);
  phone = '';
  searchQuery = '';
  selectedType = 'Tất cả loại hình';
  priceRangeValue = 5; // Giá mặc định 5 tỷ
  areaRangeValue = 200; // Diện tích mặc định 200 m2
  selectedDirection = 'Tất cả hướng';
  selectedStatus = 'Tất cả';

  activeSubTab = signal<'map' | 'potential'>('map');
  
  // Potential Heatmap State
  selectedPotentialRegion = signal<'thuduc' | 'binhduong'>('thuduc');
  selectedPill = signal<string>('Tổng hợp');
  activeHotspotName = signal<string>('Trường Thọ');
  potentialSearchQuery = '';
  potentialTimeRange = '12 tháng gần nhất';
  
  // Layer options
  layers = {
    interest: true,
    priceSpeed: true,
    traffic: true,
    planning: true,
    density: false,
    liquidity: false
  };

  private readonly platformId = inject(PLATFORM_ID);
  private leafletMap: any;
  private heatmapLayer: any;
  private markers: any[] = [];
  private currentTileLayer: any;
  isSatelliteMode = signal<boolean>(false);

  regionsData: Record<'thuduc' | 'binhduong', any> = {
    thuduc: {
      name: 'TP. Thủ Đức (TP.HCM)',
      subName: 'Đô thị sáng tạo tương tác cao phía Đông',
      score: 89,
      rating: 'Rất cao',
      trafficScore: 92,
      planningScore: 88,
      densityScore: 75,
      growthRate: 90,
      liquidityScore: 85,
      priceTrend: '+18.6% (55-145 tr/m²)',
      interestTrend: '+24.3% tìm kiếm',
      developmentTrend: 'TP. Thủ Đức định hướng phát triển là Đô thị sáng tạo tương tác cao phía Đông TP.HCM. Trọng điểm phát triển hạ tầng xoay quanh Tuyến Metro số 1 Bến Thành - Suối Tiên, siêu dự án Vành Đai 3 kết nối và quy hoạch lõi đô thị cảng thông minh Trường Thọ đến năm 2040.',
      highlights: [
        'Vận hành thương mại Tuyến Metro số 1',
        'Vành Đai 3 TP.HCM thi công thần tốc',
        'Quy hoạch khu đô thị cảng sáng tạo Trường Thọ',
        'Khu công nghệ cao TP.HCM (SHTP) hút vốn FDI',
        'Trung tâm tài chính quốc tế Thủ Thiêm phát triển'
      ],
      forecastPrice: '+15% - 20% / năm',
      forecastInterest: '+20% - 25% quý tới',
      forecastLiquidity: 'Thanh khoản Cao',
      projects: [
        { name: 'Vinhomes Grand Park (Quận 9)', price: '52 - 85 tr/m²', img: 'images/phankhu/vinhomes-aerial.jpg' },
        { name: 'The Global City (An Phú)', price: '110 - 160 tr/m²', img: 'images/phankhu/ivy-villa.jpg' },
        { name: 'Eaton Park (Mai Chí Thọ)', price: '120 - 145 tr/m²', img: 'images/phankhu/ivy-shophouse.jpg' }
      ],
      hotspots: [
        { name: 'Trường Thọ', score: 92, lat: 10.825, lng: 106.762, price: '85 - 110 tr/m²', projects: 'Trường Thọ Urban, Metro Star', description: 'Định hướng là trung tâm hành chính và Đô thị cảng sáng tạo tương lai của TP. Thủ Đức, phát triển logistic thông minh.' },
        { name: 'Thủ Đức', score: 89, lat: 10.849, lng: 106.772, price: '75 - 95 tr/m²', projects: 'King Crown Infinity, Moonlight Residences', description: 'Trung tâm hiện hữu sầm uất với mật độ giao thương cao, giá trị thương mại lớn tại mặt tiền Võ Văn Ngân.' },
        { name: 'Linh Trung', score: 86, lat: 10.862, lng: 106.787, price: '55 - 70 tr/m²', projects: 'Linh Trung Urban, Avenue Tower', description: 'Liền kề Khu công nghệ cao và Làng Đại học. Nhu cầu thuê căn hộ của chuyên gia và sinh viên luôn dẫn đầu khu vực.' },
        { name: 'Thảo Điền', score: 93, lat: 10.803, lng: 106.732, price: '120 - 180 tr/m²', projects: 'Masteri Thảo Điền, Q2 Thảo Điền', description: 'Khu biệt thự và căn hộ hạng sang bên sông Sài Gòn. Nơi tập trung cộng đồng người nước ngoài và giới thượng lưu.' },
        { name: 'Tam Bình', score: 78, lat: 10.858, lng: 106.745, price: '48 - 60 tr/m²', projects: 'Savills Tam Bình, Đạt Gia Residence', description: 'Khu vực tiềm năng giao thoa Quốc lộ 1A và Phạm Văn Đồng. Hưởng lợi trực tiếp khi đường Vành Đai 2 khép kín.' },
        { name: 'Phước Long B', score: 80, lat: 10.812, lng: 106.780, price: '65 - 85 tr/m²', projects: 'Flora Anh Đào, Valora Kikyo', description: 'Hưởng lợi gián tiếp từ dự án The Global City liền kề, hạ tầng mở rộng trục Đỗ Xuân Hợp thúc đẩy giá trị.' },
        { name: 'Hiệp Bình Phước', score: 77, lat: 10.852, lng: 106.719, price: '60 - 80 tr/m²', projects: 'Vạn Phúc City, Urban Green', description: 'Trục Quốc lộ 13 đi Bình Dương. Phát triển vượt bậc nhờ đại đô thị Vạn Phúc City và hạ tầng nâng cấp giao thông.' },
        { name: 'Bình Thọ', score: 72, lat: 10.838, lng: 106.765, price: '80 - 105 tr/m²', projects: 'Khu biệt thự Bình Thọ', description: 'Khu biệt thự cổ kính có mảng xanh lớn nhất Thủ Đức. Giá đất thổ cư cao và giữ giá ổn định bậc nhất.' },
        { name: 'Hiệp Bình Chánh', score: 82, lat: 10.828, lng: 106.726, price: '70 - 95 tr/m²', projects: 'Opal Garden, Opal Riverside', description: 'Vị trí ven sông Sài Gòn cận kề Bình Thạnh. Di chuyển cực nhanh ra sân bay qua đại lộ Phạm Văn Đồng.' },
        { name: 'Phú Hữu', score: 69, lat: 10.793, lng: 106.795, price: '55 - 75 tr/m²', projects: 'Verosa Park, Merita Khang Điền', description: 'Khu đô thị thấp tầng compound biệt lập. Kết nối cao tốc thuận lợi, hạ tầng cầu đường liên tục nâng cấp.' }
      ]
    },
    binhduong: {
      name: 'Tỉnh Bình Dương',
      subName: 'Đô thị Thông minh trực thuộc Trung ương',
      score: 85,
      rating: 'Cao',
      trafficScore: 89,
      planningScore: 85,
      densityScore: 70,
      growthRate: 88,
      liquidityScore: 80,
      priceTrend: '+12.4% (32-95 tr/m²)',
      interestTrend: '+19.8% tìm kiếm',
      developmentTrend: 'Tỉnh Bình Dương định hướng trở thành thành phố trực thuộc Trung ương trước năm 2030. Các trục giao thông huyết mạch như mở rộng Quốc lộ 13 lên 8 làn xe, Mỹ Phước - Tân Vạn, và kết nối Metro số 1 kéo dài đến Dĩ An là lực đẩy lớn cho bất động sản.',
      highlights: [
        'Mở rộng Quốc lộ 13 (Đại lộ BD) lên 8 làn xe',
        'Tuyến Mỹ Phước - Tân Vạn kết nối logistic vùng',
        'Bình Dương liên tiếp lọt Top 1 Cộng đồng thông minh',
        'Đầu tư FDI khổng lồ (KCN VSIP III & nhà máy Lego)',
        'Đề xuất tuyến Metro số 1 kéo dài về Dĩ An'
      ],
      forecastPrice: '+10% - 15% / năm',
      forecastInterest: '+15% - 20% quý tới',
      forecastLiquidity: 'Thanh khoản Ổn định',
      projects: [
        { name: 'Astral City (Thuận An)', price: '38 - 48 tr/m²', img: 'images/phankhu/vinhomes-aerial.jpg' },
        { name: 'Sycamore (Thành phố Mới)', price: '60 - 95 tr/m²', img: 'images/phankhu/ivy-villa.jpg' },
        { name: 'The Felix (Thuận An)', price: '32 - 38 tr/m²', img: 'images/phankhu/ivy-interior.jpg' }
      ],
      hotspots: [
        { name: 'Dĩ An (Đông Hòa)', score: 88, lat: 10.902, lng: 106.785, price: '38 - 48 tr/m²', projects: 'Bcons City, HT Pearl, Charm City', description: 'Đô thị vệ tinh giáp ranh Thủ Đức. Đón đầu quy hoạch kéo dài Metro số 1 Bến Thành - Suối Tiên về ga Dĩ An.' },
        { name: 'Thuận An (Lái Thiêu)', score: 85, lat: 10.915, lng: 106.695, price: '36 - 45 tr/m²', projects: 'Astral City, The Emerald Golf View', description: 'Khu vực thương mại sầm uất giáp ranh TP.HCM qua QL13. Tập trung AEON Mall Bình Dương và sân golf Sông Bé.' },
        { name: 'Thủ Dầu Một', score: 82, lat: 10.980, lng: 106.660, price: '45 - 65 tr/m²', projects: 'Happy One Central, Compass One', description: 'Thủ phủ văn hóa hành chính của Bình Dương. Hạ tầng đô thị kiểu mẫu, tỷ lệ phủ kín cao dân cư trí thức.' },
        { name: 'Bến Cát', score: 74, lat: 11.130, lng: 106.600, price: '22 - 32 tr/m²', projects: 'Oasis City, Golden Center City', description: 'Mới nâng cấp lên thành phố năm 2024. Đại đô thị công nghiệp lớn với nhiều cơ hội đầu tư đất nền giá rẻ.' },
        { name: 'Tân Uyên', score: 70, lat: 11.020, lng: 106.790, price: '25 - 35 tr/m²', projects: 'VSIP III Land, Bcons Plaza', description: 'Thành phố trẻ đột phá nhờ KCN xanh VSIP III quy mô lớn, thu hút siêu dự án sản xuất thông minh của Lego.' }
      ]
    }
  };

  currentRegion = computed(() => this.regionsData[this.selectedPotentialRegion()]);
  activeHotspot = computed(() => {
    const region = this.currentRegion();
    return region.hotspots.find((h: any) => h.name === this.activeHotspotName()) || region.hotspots[0];
  });

  constructor() {
    effect(() => {
      const tab = this.activeSubTab();
      const region = this.selectedPotentialRegion();
      const satellite = this.isSatelliteMode();
      if (tab === 'potential') {
        setTimeout(() => {
          this.initOrUpdateLeafletMap();
        }, 50);
      }
    });
  }

  initOrUpdateLeafletMap() {
    if (!isPlatformBrowser(this.platformId)) return;

    const mapElement = document.getElementById('potentialLeafletMap');
    if (!mapElement) return;

    import('leaflet').then(L => {
      (window as any).L = L;
      import('leaflet.heat').then(() => {
        const coords = this.selectedPotentialRegion() === 'thuduc' ? [10.825, 106.762] : [10.980, 106.660];
        const zoom = this.selectedPotentialRegion() === 'thuduc' ? 12 : 11;

        if (!this.leafletMap) {
          this.leafletMap = L.map('potentialLeafletMap', {
            zoomControl: false,
            attributionControl: false
          }).setView(coords as any, zoom);
        } else {
          this.leafletMap.setView(coords as any, zoom);
        }

        // Clean up previous layers
        if (this.currentTileLayer) {
          this.leafletMap.removeLayer(this.currentTileLayer);
        }
        if (this.heatmapLayer) {
          this.leafletMap.removeLayer(this.heatmapLayer);
        }
        this.markers.forEach(m => this.leafletMap.removeLayer(m));
        this.markers = [];

        // Add Tile layer
        const tileUrl = this.isSatelliteMode() 
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

        this.currentTileLayer = L.tileLayer(tileUrl, {
          maxZoom: 18
        }).addTo(this.leafletMap);

        // Add Heatmap points
        const region = this.currentRegion();
        const heatPoints: [number, number, number][] = [];
        
        region.hotspots.forEach((h: any) => {
          heatPoints.push([h.lat, h.lng, h.score / 100]);
          for (let i = 0; i < 20; i++) {
            const latOffset = (Math.random() - 0.5) * 0.02;
            const lngOffset = (Math.random() - 0.5) * 0.02;
            heatPoints.push([h.lat + latOffset, h.lng + lngOffset, (h.score / 100) * 0.5]);
          }
        });

        this.heatmapLayer = (L as any).heatLayer(heatPoints, {
          radius: 35,
          blur: 25,
          maxZoom: 15,
          max: 1.0,
          gradient: {
            0.2: '#3b82f6', // blue
            0.4: '#10b981', // green
            0.6: '#eab308', // yellow
            0.8: '#f97316', // orange
            1.0: '#ef4444'  // red
          }
        }).addTo(this.leafletMap);

        // Add Hotspot Marker Icons
        region.hotspots.forEach((h: any) => {
          const isActive = this.activeHotspotName() === h.name;
          const markerHtml = `
            <div class="leaflet-hotspot-marker ${isActive ? 'active' : ''}">
              <div class="marker-dot"></div>
              <div class="marker-label">
                <span class="hotspot-name">${h.name}</span>
                <span class="hotspot-score">${h.score}/100</span>
              </div>
            </div>
          `;

          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-leaflet-div-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          const marker = L.marker([h.lat, h.lng] as any, { icon: customIcon })
            .addTo(this.leafletMap)
            .on('click', () => {
              this.activeHotspotName.set(h.name);
              this.updateMarkerHighlights(L);
            });

          this.markers.push(marker);
        });

      });
    });
  }

  updateMarkerHighlights(L: any) {
    const region = this.currentRegion();
    this.markers.forEach((marker, index) => {
      const h = region.hotspots[index];
      const isActive = this.activeHotspotName() === h.name;
      const markerHtml = `
        <div class="leaflet-hotspot-marker ${isActive ? 'active' : ''}">
          <div class="marker-dot"></div>
          <div class="marker-label">
            <span class="hotspot-name">${h.name}</span>
            <span class="hotspot-score">${h.score}/100</span>
          </div>
        </div>
      `;
      const newIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      marker.setIcon(newIcon);
    });
  }

  zoomIn() {
    if (this.leafletMap) {
      this.leafletMap.zoomIn();
    }
  }

  zoomOut() {
    if (this.leafletMap) {
      this.leafletMap.zoomOut();
    }
  }

  toggleSatellite() {
    this.isSatelliteMode.update(v => !v);
  }

  selectPotentialRegion(regionKey: 'thuduc' | 'binhduong') {
    this.selectedPotentialRegion.set(regionKey);
    const defaultHotspot = this.regionsData[regionKey].hotspots[0].name;
    this.activeHotspotName.set(defaultHotspot);
  }

  // Modal signals
  isDetailModalOpen = signal<boolean>(false);
  activeModalImageIndex = signal<number>(0);

  // Dữ liệu các phân khu thực tế từ Vinhomes Saigon Park (Hóc Môn)
  zones: Zone[] = [
    {
      id: 1,
      name: 'The Beverly Solari',
      color: '#3B82F6', // Xanh dương
      units: 'Căn hộ cao cấp',
      products: ['Căn hộ 1-3PN', 'Studio', 'Shophouse khối đế'],
      priceRange: '2.8 - 5.5 tỷ',
      areaRange: '28 - 105 m²',
      status: 'Đang mở bán',
      mapX: '33.3%',
      mapY: '34.2%',
      polygonPoints: '118,596 157,577 581,218 766,270 776,258 808,267 802,280 878,306 903,304 880,338 822,329 384,567',
      details: {
        title: 'Phân khu The Beverly Solari',
        subtitle: 'Tâm điểm phồn hoa bờ Tây nước Mỹ',
        description: 'The Beverly Solari mang đậm chất sống phóng khoáng, đẳng cấp của bờ Tây nước Mỹ. Sở hữu quảng trường Golden Eagle rộng lớn, đại lộ Rodeo sầm uất và thiết kế cảnh quan lấy cảm hứng từ chim đại bàng.',
        images: [
          'images/phankhu/master-plan.jpg',
          'images/phankhu/vinhomes-aerial.jpg'
        ],
        highlights: [
          '🦅 Quảng trường Golden Eagle với hồ nước rộng 2.000m2',
          '🛍️ Đại lộ mua sắm Rodeo sầm uất bậc nhất',
          '🏊 Tuyến đường dạo bộ và công viên nội khu phong cách nhiệt đới',
          '🏢 Vị trí kế cận trung tâm thương mại Vincom Mega Mall'
        ],
        specs: [
          { label: 'Vị trí phân khu', value: 'Vinhomes Grand Park, TP. Thủ Đức, TP. HCM' },
          { label: 'Quy mô', value: '13 tòa tháp căn hộ' },
          { label: 'Tiện ích', value: 'Hơn 200 tiện ích nội khu đẳng cấp' },
          { label: 'Bàn giao', value: 'Quý IV/2024' }
        ]
      }
    },
    {
      id: 2,
      name: 'The Opus One',
      color: '#0EA5E9', // Xanh nhạt
      units: 'Căn hộ hạng sang',
      products: ['Căn hộ cao cấp', 'Duplex', 'Penthouse'],
      priceRange: '3.5 - 12.0 tỷ',
      areaRange: '32 - 150 m²',
      status: 'Đang mở bán',
      mapX: '42.7%',
      mapY: '38.2%',
      polygonPoints: '398,566 712,532 853,528 878,345 824,335',
      details: {
        title: 'Phân khu The Opus One',
        subtitle: 'Kiệt tác không gian sống đỉnh cao',
        description: 'Là một trong những phân khu cao cấp nhất dự án, The Opus One mang đến chuẩn mực sống thượng lưu với thiết kế hiện đại, tầm nhìn trực diện đại công viên 36ha và tiêu chuẩn bàn giao khắt khe nhất.',
        images: [
          'images/phankhu/vinhomes-aerial.jpg',
          'images/phankhu/master-plan.jpg'
        ],
        highlights: [
          '👑 Vị trí độc tôn, tầm nhìn trực diện công viên 36ha',
          '🌟 Dịch vụ quản lý tiêu chuẩn 5 sao',
          '🏊 Hồ bơi vô cực vô cực và không gian cảnh quan đẳng cấp',
          '💎 Thiết kế căn hộ thông minh với tiêu chuẩn bàn giao quốc tế'
        ],
        specs: [
          { label: 'Vị trí phân khu', value: 'Trung tâm Vinhomes Grand Park' },
          { label: 'Tiêu chuẩn', value: 'Ruby / Diamond cao cấp' },
          { label: 'Sản phẩm', value: 'Căn hộ 1-3PN, Duplex' },
          { label: 'Bàn giao', value: 'Quý I/2025' }
        ]
      }
    },
    {
      id: 3,
      name: 'The Beverly',
      color: '#F97316', // Cam
      units: 'Căn hộ Ruby cao cấp',
      products: ['Căn hộ', 'Shophouse'],
      priceRange: '2.6 - 8.5 tỷ',
      areaRange: '40 - 120 m²',
      status: 'Sắp mở bán',
      mapX: '38.8%',
      mapY: '56.5%',
      polygonPoints: '863,526 1295,537 1273,415 1278,400 912,300 885,339',
      details: {
        title: 'Phân khu The Beverly',
        subtitle: 'Sống chuẩn chất Mỹ giữa lòng phố Đông',
        description: 'Lấy cảm hứng từ ngọn đồi Beverly Hills danh giá, The Beverly mang đến không gian sống nghỉ dưỡng xa hoa với chuỗi hồ bơi nước mặn, công viên phong cách Hollywood và sảnh đón tiếp sang trọng.',
        images: [
          'images/phankhu/master-plan.jpg'
        ],
        highlights: [
          '🌴 Vị trí trực diện công viên 36ha lớn nhất Đông Nam Á',
          '🌊 Hồ bơi nước mặn Marina Pool độc đáo',
          '🎬 Tiện ích nội khu phong cách Hollywood',
          '🏢 Thiết kế mặt ngoài sang trọng, toàn bộ phủ kính Low-E'
        ],
        specs: [
          { label: 'Vị trí phân khu', value: 'Kế cận công viên 36ha, TTTM Vincom' },
          { label: 'Quy mô', value: '10 tòa tháp' },
          { label: 'Loại hình sản phẩm', value: 'Căn hộ tiêu chuẩn Ruby và Diamond' },
          { label: 'Dự kiến bàn giao', value: 'Năm 2024' }
        ]
      }
    },
    {
      id: 4,
      name: 'The Manhattan',
      color: '#10B981', // Xanh lá
      units: 'Thấp tầng thương mại',
      products: ['Shophouse', 'Boutique Villa', 'Biệt thự'],
      priceRange: '21.0 - 65.0 tỷ',
      areaRange: '84 - 450 m²',
      status: 'Đã bàn giao',
      mapX: '44.1%',
      mapY: '74.3%',
      polygonPoints: '1283,401 1838,550 1304,537 1278,415',
      details: {
        title: 'Phân khu The Manhattan',
        subtitle: 'Trái tim thương mại sầm uất',
        description: 'Tọa lạc tại vị trí trái tim của đại đô thị, The Manhattan quy tụ các sản phẩm nhà phố thương mại, boutique villa và biệt thự ven sông, tạo nên quần thể giao thương sầm uất và không gian sống thượng lưu.',
        images: [
          'images/phankhu/vinhomes-aerial.jpg'
        ],
        highlights: [
          '🛍️ Ôm trọn đại công viên 36ha và hồ trung tâm',
          '🛥️ Kế cận bến du thuyền Manhattan Glory cao cấp',
          '🏪 Khả năng khai thác thương mại vượt trội',
          '🌳 Không gian sống biệt lập với hệ thống an ninh đa lớp'
        ],
        specs: [
          { label: 'Vị trí phân khu', value: 'Trung tâm công viên 36ha' },
          { label: 'Loại hình', value: 'Shophouse thương mại, Biệt thự Riverside' },
          { label: 'Tình trạng', value: 'Đã hoàn thiện và đi vào kinh doanh' },
          { label: 'Tiện ích', value: 'Công viên nghệ thuật Broadway, Bến thuyền' }
        ]
      }
    },
    {
      id: 5,
      name: 'The Rainbow',
      color: '#8B5CF6', // Tím
      units: 'Căn hộ hiện đại',
      products: ['Căn hộ', 'Shophouse'],
      priceRange: '1.6 - 3.5 tỷ',
      areaRange: '30 - 81 m²',
      status: 'Đã bàn giao',
      mapX: '61.1%',
      mapY: '85.7%',
      polygonPoints: '1304,547 1782,556 1796,559 1806,566 1818,578 1821,600 1833,673 1879,959 1673,897 1573,671 1416,663 1356,649 1327,654',
      details: {
        title: 'Phân khu The Rainbow',
        subtitle: 'Sắc màu cuộc sống năng động',
        description: 'The Rainbow là phân khu đầu tiên được bàn giao tại Vinhomes Grand Park, nổi bật với Quảng trường Cầu vồng và hệ thống tiện ích thể thao phong phú, mang đến nhịp sống trẻ trung và năng động.',
        images: [
          'images/phankhu/master-plan.jpg'
        ],
        highlights: [
          '🌈 Quảng trường Cầu vồng rực rỡ sắc màu',
          '🏃 Hàng chục sân thể thao và công viên nội khu đa dạng',
          '🏢 Cộng đồng cư dân đã hình thành và sầm uất',
          '🚗 Giao thông thuận tiện, kết nối trực tiếp đường Nguyễn Xiển'
        ],
        specs: [
          { label: 'Vị trí phân khu', value: 'Mặt tiền Nguyễn Xiển, Long Thạnh Mỹ' },
          { label: 'Quy mô', value: '17 tòa tháp, hơn 10.000 căn hộ' },
          { label: 'Tiện ích', value: 'Trường học Vinschool, siêu thị, phòng khám' },
          { label: 'Tình trạng', value: 'Cộng đồng cư dân đông đúc' }
        ]
      }
    }
  ];

  getZoneName(id: number | null): string {
    if (!id) return 'Vinhomes Grand Park';
    const zone = this.zones.find(z => z.id === id);
    return zone ? zone.name : 'Vinhomes Grand Park';
  }

  trackProjectView(projectName: string) {
    if (this.currentTrackedProject && this.entryTime > 0) {
      const elapsed = Math.floor((Date.now() - this.entryTime) / 1000);
      const increment = elapsed - this.lastLoggedDuration;
      if (increment > 0) {
        this.customerService.trackInteraction(this.currentTrackedProject, false, increment);
      }
    }

    this.currentTrackedProject = projectName;
    this.entryTime = Date.now();
    this.lastLoggedDuration = 0;
    this.customerService.trackInteraction(projectName, true, 0);
  }

  selectZone(id: number) {
    this.activeZone.set(id);
    if (!this.currentTrackedProject) {
      const zoneName = this.getZoneName(id);
      this.trackProjectView(zoneName);
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const projName = params['project'];
      if (projName) {
        const zone = this.zones.find(z => z.name.toLowerCase().includes(projName.toLowerCase()) || projName.toLowerCase().includes(z.name.toLowerCase()));
        if (zone) {
          this.activeZone.set(zone.id);
        }
        this.trackProjectView(projName);
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => {
        if (this.currentTrackedProject && this.entryTime > 0) {
          const elapsed = Math.floor((Date.now() - this.entryTime) / 1000);
          const increment = elapsed - this.lastLoggedDuration;
          if (increment > 0) {
            this.customerService.trackInteraction(this.currentTrackedProject, false, increment);
            this.lastLoggedDuration = elapsed;
          }
        }
      }, 5000);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.currentTrackedProject && this.entryTime > 0) {
      const elapsed = Math.floor((Date.now() - this.entryTime) / 1000);
      const increment = elapsed - this.lastLoggedDuration;
      if (increment > 0) {
        this.customerService.trackInteraction(this.currentTrackedProject, false, increment);
      }
    }
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

  openSurveyModal() {
    this.surveyModalService.open('Vinhomes Saigon Park');
    this.surveyModalService.setField('specialNeed', 'Nhận bảng giá');
    this.surveyModalService.setField('purpose', 'invest');
  }

  openSurveyModalWithConsult() {
    this.surveyModalService.open('Vinhomes Saigon Park');
    this.surveyModalService.setField('specialNeed', 'Nhận tư vấn');
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

