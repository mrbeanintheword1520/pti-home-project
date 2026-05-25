import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsultationModalService } from '../consultation/consultation-modal.service';
import {
  MARKET_INDEX,
  MARKET_METRICS,
  PRICE_PERIODS,
  PRICE_TRENDS,
  TOP_GROWTH_AREAS,
} from './home-market.data';

interface ProjectCard {
  name: string;
  location: string;
  price: string;
  growth: string;
  image: string;
  tag: string;
  tagType: 'new' | 'selling';
}

interface TransactionCard {
  name: string;
  project: string;
  period: string;
  profit: string;
  avatar: string;
}

interface ToolItem {
  title: string;
  description: string;
  icon: string;
  link: string;
}

interface NewsItem {
  title: string;
  date: string;
  image: string;
  featured?: boolean;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class Home {
  protected readonly consultation = inject(ConsultationModalService);

  readonly marketIndex = MARKET_INDEX;
  readonly pricePeriods = PRICE_PERIODS;
  readonly growthAreas = TOP_GROWTH_AREAS;
  readonly metrics = MARKET_METRICS;

  activePricePeriod = signal<(typeof PRICE_PERIODS)[number]>('1M');
  readonly selectedPriceTrend = computed(
    () => PRICE_TRENDS[this.activePricePeriod()],
  );
  readonly priceValueRange = computed(() => {
    const values = this.selectedPriceTrend().series.flatMap((line) => line.values);
    const min = Math.floor(Math.min(...values) / 10) * 10;
    const max = Math.ceil(Math.max(...values) / 10) * 10;
    return { min, max };
  });
  readonly priceYAxisLabels = computed(() => {
    const { min, max } = this.priceValueRange();
    const step = (max - min) / 3;
    return [max, max - step, max - step * 2, min].map((value) =>
      Math.round(value),
    );
  });
  readonly priceSeriesStats = computed(() =>
    this.selectedPriceTrend().series.map((line) => {
      const first = line.values[0];
      const latest = line.values[line.values.length - 1];
      const change = ((latest - first) / first) * 100;

      return {
        area: line.area,
        color: line.color,
        latest,
        latestLabel: `${latest.toFixed(0)} triệu/m²`,
        changeLabel: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
        isPositive: change >= 0,
      };
    }),
  );
  readonly marketIndexLinePoints = this.chartPoints(
    this.marketIndex.points.map((p) => p.value),
    280,
    80,
    8,
  );
  readonly marketIndexAreaPath = this.chartAreaPath(
    this.marketIndex.points.map((p) => p.value),
    280,
    80,
    8,
  );

  readonly projects: ProjectCard[] = [
    {
      name: 'Vinhomes Grand Park',
      location: 'TP. Thủ Đức, TP.HCM',
      price: 'Từ 2.8 tỷ',
      growth: '+18.7%',
      image:
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
      tag: 'Dự án mới',
      tagType: 'new',
    },
    {
      name: 'Masteri Centre Point',
      location: 'TP. Thủ Đức, TP.HCM',
      price: 'Từ 3.2 tỷ',
      growth: '+15.3%',
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
      tag: 'Đang mở bán',
      tagType: 'selling',
    },
    {
      name: 'The Global City',
      location: 'Quận 2, TP.HCM',
      price: 'Từ 4.5 tỷ',
      growth: '+22.1%',
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      tag: 'Dự án mới',
      tagType: 'new',
    },
    {
      name: 'Eaton Park',
      location: 'Quận 2, TP.HCM',
      price: 'Từ 5.1 tỷ',
      growth: '+19.4%',
      image:
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
      tag: 'Đang mở bán',
      tagType: 'selling',
    },
    {
      name: 'Aqua City',
      location: 'Đồng Nai',
      price: 'Từ 2.1 tỷ',
      growth: '+14.8%',
      image:
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
      tag: 'Đang mở bán',
      tagType: 'selling',
    },
  ];

  readonly transactions: TransactionCard[] = [
    {
      name: 'Nguyễn Văn A',
      project: 'Vinhomes Grand Park',
      period: '10/2022 - 06/2024',
      profit: '+32.5%',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
    },
    {
      name: 'Trần Thị B',
      project: 'Masteri Centre Point',
      period: '03/2023 - 08/2024',
      profit: '+28.3%',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
    },
    {
      name: 'Lê Minh C',
      project: 'The Global City',
      period: '01/2023 - 09/2024',
      profit: '+35.7%',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    },
    {
      name: 'Phạm Thu D',
      project: 'Eaton Park',
      period: '06/2022 - 12/2023',
      profit: '+26.9%',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    },
  ];

  readonly tools: ToolItem[] = [
    {
      title: 'Tư vấn đầu tư AI',
      description: 'Gợi ý dự án phù hợp với mục tiêu tài chính',
      icon: 'robot',
      link: '/cong-cu',
    },
    {
      title: 'Mô phỏng lợi nhuận',
      description: 'Dự báo lợi nhuận theo thời gian đầu tư',
      icon: 'chart',
      link: '/tinh-khoan-vay',
    },
    {
      title: 'Tính khoản vay',
      description: 'Ước tính trả góp và khả năng vay',
      icon: 'calculator',
      link: '/tinh-khoan-vay',
    },
    {
      title: 'So sánh dự án',
      description: 'Đối chiếu tiềm năng giữa các dự án',
      icon: 'compare',
      link: '/du-an',
    },
    {
      title: 'Bản đồ dự án',
      description: 'Xem vị trí và hạ tầng xung quanh',
      icon: 'map',
      link: '/du-an',
    },
    {
      title: 'Đặt lịch khảo sát',
      description: 'Hẹn tham quan thực tế nhanh chóng',
      icon: 'calendar',
      link: '/du-an',
    },
  ];

  readonly featuredNews: NewsItem[] = [
    {
      title: 'Khởi công cầu Mã Đà nối Đồng Nai và Bình Phước vào tháng 6',
      date: '19/05/2025',
      image:
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=640&h=360&fit=crop',
      featured: true,
    },
    {
      title: 'Tại sao nên mua đất Bombo Bình Phước: Cơ hội đầu tư bất động sản 2025',
      date: '18/05/2025',
      image:
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=640&h=360&fit=crop',
      featured: true,
    },
  ];

  readonly latestNews: NewsItem[] = [
    {
      title: 'Những ưu điểm khi sáp nhập Đồng Nai và Bình Phước',
      date: '19/05/2025',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=240&h=150&fit=crop',
    },
    {
      title: 'Đất NTS là gì? Tìm hiểu ký hiệu đất NTS cùng Địa Ốc Đất Ngọc',
      date: '11/04/2025',
      image:
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=240&h=150&fit=crop',
    },
    {
      title: 'Khởi công cầu Mã Đà nối Đồng Nai và Bình Phước vào tháng 6',
      date: '19/05/2025',
      image:
        'https://images.unsplash.com/photo-1465447142348-e9952c393450?w=240&h=150&fit=crop',
    },
    {
      title: 'Đất NTD là gì? Tìm hiểu chi tiết về loại đất NTD',
      date: '09/04/2025',
      image:
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=240&h=150&fit=crop',
    },
    {
      title: 'Xã Bombo: Kỳ vọng trở thành trung tâm đô thị, thương mại và du lịch',
      date: '19/05/2025',
      image:
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=240&h=150&fit=crop',
    },
    {
      title: 'TSC là đất gì? Ký hiệu đất TSC và các quy định sử dụng',
      date: '02/04/2025',
      image:
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=240&h=150&fit=crop',
    },
  ];

  carouselIndex = signal(0);
  readonly visibleProjectCount = 4;

  setPricePeriod(period: (typeof PRICE_PERIODS)[number]): void {
    this.activePricePeriod.set(period);
  }

  chartPoints(
    values: readonly number[],
    width = 400,
    height = 120,
    padding = 10,
  ): string {
    const coords = this.normalizeValues(values, width, height, padding);
    return coords.map((point) => `${point.x},${point.y}`).join(' ');
  }

  chartAreaPath(
    values: readonly number[],
    width = 400,
    height = 120,
    padding = 10,
  ): string {
    const coords = this.normalizeValues(values, width, height, padding);
    if (!coords.length) return '';

    const baseY = height - padding;
    const line = coords.map((point) => `L${point.x},${point.y}`).join(' ');
    return `M${coords[0].x},${baseY} ${line} L${coords[coords.length - 1].x},${baseY} Z`;
  }

  chartDotX(index: number, total: number, width = 400, padding = 10): number {
    if (total <= 1) return width / 2;
    return padding + (index * (width - padding * 2)) / (total - 1);
  }

  chartLabelX(index: number, total: number, width = 400, padding = 10): number {
    return this.chartDotX(index, total, width, padding);
  }

  priceChartPoints(values: readonly number[]): string {
    return values
      .map((value, index) => {
        const x = this.priceChartX(index, values.length);
        const y = this.priceChartY(value);
        return `${x},${y}`;
      })
      .join(' ');
  }

  priceChartX(index: number, total: number): number {
    const left = 36;
    const right = 42;
    const width = 420;
    if (total <= 1) return width / 2;
    return left + (index * (width - left - right)) / (total - 1);
  }

  priceChartY(value: number): number {
    const top = 20;
    const bottom = 30;
    const height = 150;
    const { min, max } = this.priceValueRange();
    const range = max - min || 1;
    return top + ((max - value) / range) * (height - top - bottom);
  }

  private normalizeValues(
    values: readonly number[],
    width: number,
    height: number,
    padding: number,
  ): { x: number; y: number }[] {
    if (!values.length) return [];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return values.map((value, index) => ({
      x:
        values.length === 1
          ? width / 2
          : padding + (index * (width - padding * 2)) / (values.length - 1),
      y: height - padding - ((value - min) / range) * (height - padding * 2),
    }));
  }

  prevProjects(): void {
    this.carouselIndex.update((i) => Math.max(0, i - 1));
  }

  nextProjects(): void {
    this.carouselIndex.update((i) => Math.min(this.maxProjectIndex(), i + 1));
  }

  maxProjectIndex(): number {
    return Math.max(0, this.projects.length - this.visibleProjectCount);
  }

  projectCarouselTransform(): string {
    const index = this.carouselIndex();
    return `translateX(calc(-${index * 25}% - ${index * 4}px))`;
  }
}
