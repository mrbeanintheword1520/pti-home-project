import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Chart from 'chart.js/auto';

Chart.defaults.font.family = "'Montserrat', sans-serif";

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './loan-calculator.component.html',
  styleUrl: './loan-calculator.component.scss',
})
export class LoanCalculator implements OnInit, AfterViewInit {
  projects: any[] = [];
  selectedProjectName: string = '';

  // Inputs
  propertyValue: number = 5000000000;
  expectedGrowthRate: number = 6; // % per year
  loanPercentage: number = 30;
  interestRate: number = 8.5; // % per year
  loanTermYears: number = 5;
  investmentTimeYears: number = 5;

  // Results
  loanAmount: number = 0;
  initialCapital: number = 0;
  
  totalInterestPaidAtEnd: number = 0;
  totalInterestFullTerm: number = 0;
  remainingBalanceAtEnd: number = 0;
  
  futurePropertyValue: number = 0;
  netProfit: number = 0;
  roi: number = 0;
  monthlyCashflow: number = 0;

  schedule: any[] = [];
  showProjectModal: boolean = false;
  showAmortizationModal: boolean = false;
  currentCarouselPage: number = 0;

  @ViewChild('growthChart') growthChartRef!: ElementRef;
  @ViewChild('cashflowChart') cashflowChartRef!: ElementRef;
  @ViewChild('structureChart') structureChartRef!: ElementRef;

  growthChart: Chart | null = null;
  cashflowChart: Chart | null = null;
  structureChart: Chart | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadProjects();
    this.calculateAll();
  }

  openProjectModal(event: Event) {
    event.preventDefault();
    this.showProjectModal = true;
  }

  closeProjectModal() {
    this.showProjectModal = false;
  }

  openAmortizationModal(event: Event) {
    event.preventDefault();
    this.showAmortizationModal = true;
  }

  closeAmortizationModal() {
    this.showAmortizationModal = false;
  }

  scrollToPage(page: number) {
    this.currentCarouselPage = page;
    const scrollElem = document.querySelector('.projects-scroll');
    if (scrollElem) {
      scrollElem.scrollTo({ left: page * 850, behavior: 'smooth' });
    }
  }

  loadProjects() {
    this.http.get<any[]>('/assets/data/projects.json').subscribe(data => {
      this.projects = data;
      if (!this.selectedProjectName) {
        this.selectedProjectName = 'Vinhomes Grand Park';
        this.onProjectChange();
      }
      this.updateProjectsComparison();
      this.cdr.detectChanges();
    });
  }

  selectProjectCard(proj: any) {
    this.selectedProjectName = proj.name;
    this.onProjectChange();
  }

  onProjectChange() {
    const proj = this.projects.find(p => p.name === this.selectedProjectName);
    if (proj) {
      const priceStr = proj.price.replace(/[^\d.]/g, '');
      const priceVal = parseFloat(priceStr);
      if (!isNaN(priceVal) && proj.price.includes('tỷ')) {
        this.propertyValue = priceVal * 1000000000;
      }
      const growthStr = proj.growth.replace(/[^\d.]/g, '');
      const growthVal = parseFloat(growthStr);
      if (!isNaN(growthVal)) {
        this.expectedGrowthRate = growthVal;
      }
      this.calculateAll();
      setTimeout(() => {
        this.renderCharts();
      }, 0);
    }
  }

  updateProjectsComparison() {
    if (!this.projects) return;
    this.projects.forEach(p => {
      const priceStr = p.price.replace(/[^\d.]/g, '');
      const priceVal = parseFloat(priceStr) * 1000000000 || 0;
      
      const growthStr = p.growth.replace(/[^\d.]/g, '');
      const growthVal = parseFloat(growthStr) || 0;
      
      const futureVal = priceVal * Math.pow(1 + growthVal / 100, this.investmentTimeYears);
      const initialCap = priceVal * (1 - this.loanPercentage / 100);
      const loanAmt = priceVal * (this.loanPercentage / 100);
      
      const months = this.loanTermYears * 12;
      const monthlyRate = this.interestRate / 100 / 12;
      const principalMonthly = loanAmt / months;
      let remBalance = loanAmt;
      let totalInterest = 0;
      
      for (let i = 1; i <= this.investmentTimeYears * 12; i++) {
        totalInterest += remBalance * monthlyRate;
        remBalance -= principalMonthly;
      }
      
      const grossProfit = futureVal - priceVal;
      const netProfit = grossProfit - totalInterest;
      const roi = initialCap > 0 ? (netProfit / initialCap) * 100 : 0;
      
      p.futureVal = this.formatCurrency(futureVal) + ' VND';
      p.profit = this.formatCurrency(netProfit) + ' VND';
      p.roi = roi.toFixed(2) + '%';
    });
  }

  ngAfterViewInit() {
    this.renderCharts();
  }

  onCalculate() {
    this.calculateAll();
    setTimeout(() => {
      this.renderCharts();
    }, 0);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(Math.round(value));
  }

  get propertyValueStr(): string {
    return this.formatCurrency(this.propertyValue);
  }
  set propertyValueStr(val: string) {
    this.propertyValue = Number(val.replace(/\D/g, '')) || 0;
  }

  calculateAll() {
    this.initialCapital = this.propertyValue * (1 - this.loanPercentage / 100);
    this.loanAmount = this.propertyValue * (this.loanPercentage / 100);

    const months = this.loanTermYears * 12;
    const monthlyInterestRate = this.interestRate / 100 / 12;
    const principalMonthly = this.loanAmount / months;

    let remainingBalance = this.loanAmount;
    this.schedule = [];

    let currentYearPrincipal = 0;
    let currentYearInterest = 0;
    let totalInterestToDate = 0;

    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      
      currentYearPrincipal += principalMonthly;
      currentYearInterest += interestPayment;
      totalInterestToDate += interestPayment;
      
      remainingBalance -= principalMonthly;

      if (i % 12 === 0 || i === months) {
        const year = Math.ceil(i / 12);
        this.schedule.push({
          year: `Năm ${year}`,
          yearNum: year,
          principalPaid: currentYearPrincipal,
          interestPaid: currentYearInterest,
          balanceEnd: Math.max(0, remainingBalance)
        });
        currentYearPrincipal = 0;
        currentYearInterest = 0;
      }
    }

    let bStart = this.loanAmount;
    this.schedule = this.schedule.map(s => {
      s.balanceStart = bStart;
      bStart = s.balanceEnd;
      return s;
    });

    this.totalInterestFullTerm = totalInterestToDate;

    // Limit schedule to investment time
    const invSchedule = this.schedule.filter(s => s.yearNum <= this.investmentTimeYears);
    if (invSchedule.length > 0) {
      const lastYear = invSchedule[invSchedule.length - 1];
      this.remainingBalanceAtEnd = lastYear.balanceEnd;
      this.totalInterestPaidAtEnd = invSchedule.reduce((acc, curr) => acc + curr.interestPaid, 0);
    } else {
      this.remainingBalanceAtEnd = this.loanAmount;
      this.totalInterestPaidAtEnd = 0;
    }

    this.futurePropertyValue = this.propertyValue * Math.pow(1 + this.expectedGrowthRate / 100, this.investmentTimeYears);
    const grossProfit = this.futurePropertyValue - this.propertyValue;
    this.netProfit = grossProfit - this.totalInterestPaidAtEnd;
    
    this.roi = this.initialCapital > 0 ? (this.netProfit / this.initialCapital) * 100 : 0;
    this.monthlyCashflow = this.netProfit / (this.investmentTimeYears * 12);
    
    this.updateProjectsComparison();
  }

  renderCharts() {
    if (!this.growthChartRef || !this.cashflowChartRef || !this.structureChartRef) return;

    if (this.growthChart) this.growthChart.destroy();
    if (this.cashflowChart) this.cashflowChart.destroy();
    if (this.structureChart) this.structureChart.destroy();

    const invSchedule = this.schedule.filter(s => s.yearNum <= this.investmentTimeYears);
    const labels = ['Hiện tại', ...invSchedule.map(s => s.year)];
    
    // Growth Chart (Line)
    const growthData = [this.propertyValue];
    for(let i=1; i<=this.investmentTimeYears; i++) {
      growthData.push(this.propertyValue * Math.pow(1 + this.expectedGrowthRate / 100, i));
    }

    this.growthChart = new Chart(this.growthChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Giá trị tài sản (VNĐ)',
          data: growthData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Cashflow Chart
    const cashflowData = [0];
    const accData = [0];
    let acc = 0;
    invSchedule.forEach(s => {
      const monthlyP = (s.principalPaid + s.interestPaid) / 12;
      cashflowData.push(monthlyP);
      acc += monthlyP * 12;
      accData.push(acc);
    });

    this.cashflowChart = new Chart(this.cashflowChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            type: 'line',
            label: 'Dòng tiền tích lũy',
            data: accData,
            borderColor: '#10b981',
            tension: 0.4
          },
          {
            type: 'bar',
            label: 'Chi phí trả nợ hàng năm',
            data: cashflowData.map(v => v * 12),
            backgroundColor: '#ef4444',
          }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    // Structure Chart
    this.structureChart = new Chart(this.structureChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Vốn tự có', 'Vốn vay'],
        datasets: [{
          data: [this.initialCapital, this.loanAmount],
          backgroundColor: ['#3b82f6', '#ef4444'],
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } }
      }
    });
  }
}
