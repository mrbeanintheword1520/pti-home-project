import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BRAND } from '../../shared/brand';
import { ConsultationModalService } from '../consultation/consultation-modal.service';

interface StatItem {
  target: number;
  suffix: string;
  label: string;
  decimals?: number;
}

interface AnimatedStat extends StatItem {
  value: string;
  animatedLabel: string;
}

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  protected readonly brand = BRAND;
  protected readonly consultation = inject(ConsultationModalService);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('introBanner') private introBanner?: ElementRef<HTMLElement>;
  @ViewChild('statsSection') private statsSection?: ElementRef<HTMLElement>;

  protected readonly isLetterOpen = signal(false);

  readonly stats: StatItem[] = [
    { target: 10, suffix: '+', label: 'Năm kinh nghiệm' },
    { target: 13, suffix: '+', label: 'Dự án đang triển khai' },
    { target: 8450, suffix: '+', label: 'Khách hàng tin tưởng' },
    { target: 4.9, suffix: '/5', label: 'Đánh giá hài lòng', decimals: 1 },
  ];

  readonly animatedStats = signal<AnimatedStat[]>(
    this.stats.map((stat) => ({
      ...stat,
      value: this.formatStatValue(stat, 0),
      animatedLabel: this.scrambleLabel(stat.label, 0),
    })),
  );

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
  readonly activeMilestoneIndex = signal(0);
  readonly activeMilestone = computed(
    () => this.milestones[this.activeMilestoneIndex()] ?? this.milestones[0],
  );

  readonly whyUs = [
    'Danh mục dự án được tuyển chọn kỹ lưỡng',
    'Dữ liệu thị trường cập nhật theo thời gian thực',
    'Hỗ trợ pháp lý và tài chính trọn gói',
    'Chăm sóc khách hàng 24/7',
  ];

  private readonly observers: IntersectionObserver[] = [];
  private readonly statFrameIds = new Set<number>();
  private readonly labelTimerIds: number[] = [];
  private statsAnimationStarted = false;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observeOnce(this.introBanner?.nativeElement, () => {
      this.isLetterOpen.set(true);
    });

    this.observeOnce(this.statsSection?.nativeElement, () => {
      this.startStatsAnimation();
    });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observers.forEach((observer) => observer.disconnect());
    this.statFrameIds.forEach((id) => cancelAnimationFrame(id));
    this.labelTimerIds.forEach((id) => window.clearInterval(id));
  }

  selectMilestone(index: number): void {
    this.activeMilestoneIndex.set(index);
  }

  private observeOnce(element: HTMLElement | undefined, onEnter: () => void): void {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        onEnter();
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    this.observers.push(observer);
  }

  private startStatsAnimation(): void {
    if (this.statsAnimationStarted) return;
    this.statsAnimationStarted = true;

    this.stats.forEach((stat, index) => {
      this.animateNumber(stat, index);
      this.animateLabel(stat, index);
    });
  }

  private animateNumber(stat: StatItem, index: number): void {
    const duration = 2600 + index * 320;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = stat.target * easedProgress;

      this.patchAnimatedStat(index, {
        value: this.formatStatValue(stat, currentValue),
      });

      if (progress < 1) {
        const frameId = requestAnimationFrame(tick);
        this.statFrameIds.add(frameId);
      } else {
        this.patchAnimatedStat(index, {
          value: this.formatStatValue(stat, stat.target),
        });
      }
    };

    const frameId = requestAnimationFrame(tick);
    this.statFrameIds.add(frameId);
  }

  private animateLabel(stat: StatItem, index: number): void {
    const labelChars = Array.from(stat.label);
    const frameCount = 42 + index * 8;
    let frame = 0;

    const timerId = window.setInterval(() => {
      frame += 1;
      const revealCount = Math.floor((frame / frameCount) * labelChars.length);
      const animatedLabel = labelChars
        .map((char, charIndex) => {
          if (char === ' ') return ' ';
          return charIndex < revealCount ? char : this.randomScrambleChar();
        })
        .join('');

      this.patchAnimatedStat(index, { animatedLabel });

      if (frame >= frameCount) {
        window.clearInterval(timerId);
        this.patchAnimatedStat(index, { animatedLabel: stat.label });
      }
    }, 58);

    this.labelTimerIds.push(timerId);
  }

  private patchAnimatedStat(index: number, patch: Partial<AnimatedStat>): void {
    this.animatedStats.update((stats) =>
      stats.map((stat, statIndex) => (statIndex === index ? { ...stat, ...patch } : stat)),
    );
  }

  private formatStatValue(stat: StatItem, value: number): string {
    const formattedValue =
      stat.decimals !== undefined
        ? value.toFixed(stat.decimals)
        : Math.round(value).toLocaleString('en-US');

    return `${formattedValue}${stat.suffix}`;
  }

  private scrambleLabel(label: string, revealCount: number): string {
    return Array.from(label)
      .map((char, index) => {
        if (char === ' ') return ' ';
        return index < revealCount ? char : this.randomScrambleChar();
      })
      .join('');
  }

  private randomScrambleChar(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*';
    return chars[Math.floor(Math.random() * chars.length)];
  }
}
