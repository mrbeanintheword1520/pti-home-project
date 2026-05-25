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

  activePricePeriod = signal<(typeof PRICE_PERIODS)[number]>('1Y');
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
    },
    {
      title: 'Mô phỏng lợi nhuận',
      description: 'Dự báo lợi nhuận theo thời gian đầu tư',
      icon: 'chart',
    },
    {
      title: 'Tính khoản vay',
      description: 'Ước tính trả góp và khả năng vay',
      icon: 'calculator',
    },
    {
      title: 'So sánh dự án',
      description: 'Đối chiếu tiềm năng giữa các dự án',
      icon: 'compare',
    },
    {
      title: 'Bản đồ dự án',
      description: 'Xem vị trí và hạ tầng xung quanh',
      icon: 'map',
    },
    {
      title: 'Đặt lịch khảo sát',
      description: 'Hẹn tham quan thực tế nhanh chóng',
      icon: 'calendar',
    },
  ];

  carouselIndex = signal(0);

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
    const max = Math.max(0, this.projects.length - 4);
    this.carouselIndex.update((i) => Math.min(max, i + 1));
  }
}
