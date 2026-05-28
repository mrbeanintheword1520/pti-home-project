import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  project: string;
  subdivision?: string;
  budget: string;
  score: number;
  interestLevel: string; // 'Lead nóng', 'Tiềm năng', 'Tham khảo'
  views: number;
  docs: number;
  behavior: string;
  agent: string;
  status: string; // 'Mới', 'Đang tư vấn', 'Đã cọc', 'Không liên lạc được'
  source: string;
  createdAt: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointments?: {
    id: string;
    project: string;
    appointmentDate: string;
    appointmentTime: string;
    agent: string;
    status: string;
    createdAt?: string;
  }[];
  chatHistory?: { sender: 'agent' | 'client'; text: string; time: string; file?: { name: string; size: string } }[];
  activityLog?: { type: string; title: string; time: string; desc: string }[];
  projectInteractions?: { [projectName: string]: { clicks: number; durationSeconds: number } };
}

@Component({
  selector: 'app-smart-leads',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './smart-leads.component.html',
  styleUrl: './smart-leads.component.scss'
})
export class SmartLeadsComponent implements OnInit {
  private readonly API_URL = 'http://localhost:3000/api/leads';

  // State signals
  leads = signal<Lead[]>([]);
  isLoading = signal(true);
  selectedLead = signal<Lead | null>(null);
  activeTab = signal('overview');
  newChatMessage = signal('');
  chatMessages = signal<{ sender: 'agent' | 'client'; text: string; time: string; file?: { name: string; size: string } }[]>([]);
  
  // Filter inputs
  searchQuery = signal('');
  selectedLevel = signal('Tất cả');
  selectedProject = signal('Tất cả');
  selectedSource = signal('Tất cả');
  selectedAgent = signal('Tất cả');

  // Pagination
  currentPage = signal(1);
  pageSize = 10;

  // Options lists
  levelOptions = ['Tất cả', 'Lead nóng', 'Tiềm năng', 'Tham khảo'];
  projectOptions: string[] = ['Tất cả', 'Vinhomes Grand Park', 'The Beverly', 'The Beverly Solari', 'Lumière Boulevard', 'The Manhattan', 'The Origami', 'Vinhomes Saigon Park'];
  sourceOptions: string[] = ['Tất cả', 'Facebook Ads', 'Google Ads', 'Tìm kiếm tự nhiên', 'Zalo', 'Khác'];
  agentOptions: string[] = ['Tất cả', 'Nguyễn Hoàng', 'Trần Minh Thư', 'Trần Minh Như', 'Lê Quốc Bảo', 'Phạm Thị Mai', 'Phạm Mại', 'Hoàng Văn Nam'];
  statusOptions = ['Mới', 'Đang tư vấn', 'Đã cọc', 'Không liên lạc được'];

  updateFilterOptions(leadsList: Lead[]): void {
    const projects = new Set<string>();
    const sources = new Set<string>();
    const agents = new Set<string>();

    // Seed default options so they always exist
    ['Vinhomes Grand Park', 'The Beverly', 'The Beverly Solari', 'Lumière Boulevard', 'The Manhattan', 'The Origami', 'Vinhomes Saigon Park'].forEach(p => projects.add(p));
    ['Facebook Ads', 'Google Ads', 'Tìm kiếm tự nhiên', 'Zalo', 'Khác'].forEach(s => sources.add(s));
    ['Nguyễn Hoàng', 'Trần Minh Thư', 'Trần Minh Như', 'Lê Quốc Bảo', 'Phạm Thị Mai', 'Phạm Mại', 'Hoàng Văn Nam'].forEach(a => agents.add(a));

    leadsList.forEach(l => {
      if (l.project) projects.add(l.project);
      if (l.subdivision) projects.add(l.subdivision);
      if (l.source) sources.add(l.source);
      if (l.agent) agents.add(l.agent);
    });

    this.projectOptions = ['Tất cả', ...Array.from(projects)];
    this.sourceOptions = ['Tất cả', ...Array.from(sources)];
    this.agentOptions = ['Tất cả', ...Array.from(agents)];
  }

  ngOnInit(): void {
    this.fetchLeads();
    // Tự động tải lại mỗi 5 giây để cập nhật Leads mới đăng ký theo thời gian thực!
    setInterval(() => this.fetchLeads(false), 5000);
  }

  fetchLeads(showLoader = true): void {
    if (showLoader) this.isLoading.set(true);

    fetch(this.API_URL)
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data: Lead[]) => {
        this.leads.set(data);
        this.updateFilterOptions(data);
        const selected = this.selectedLead();
        if (selected) {
          const updated = data.find(l => l.id === selected.id);
          if (updated) {
            this.selectedLead.set(updated);
            if (updated.chatHistory) {
              this.chatMessages.set(updated.chatHistory);
            }
          }
        }
        if (showLoader) this.isLoading.set(false);
      })
      .catch(err => {
        console.warn('Backend server offline. Using simulated local storage/mock data.');
        this.loadMockLeads();
        if (showLoader) this.isLoading.set(false);
      });
  }

  loadMockLeads(): void {
    const raw = localStorage.getItem('pti_simulated_leads');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.leads.set(parsed);
        this.updateFilterOptions(parsed);
        return;
      } catch (e) {
        // Fallback to defaults
      }
    }

    // Default mock data matching the screenshot
    const defaultMock: Lead[] = [
      {
        id: 'lead-1',
        name: 'Trần Minh Đức',
        email: 'duc.tran@gmail.com',
        phone: '0901 234 567',
        address: 'TP. Thủ Đức, TP.HCM',
        project: 'Vinhomes Grand Park',
        subdivision: 'The Beverly',
        budget: '3 - 5 tỷ',
        score: 92,
        interestLevel: 'Lead nóng',
        views: 15,
        docs: 3,
        behavior: 'Đã dùng công cụ',
        agent: 'Nguyễn Hoàng',
        status: 'Đang tư vấn',
        source: 'Facebook Ads',
        createdAt: new Date(Date.now() - 30 * 60000).toISOString()
      },
      {
        id: 'lead-2',
        name: 'Lê Thị Thu Hà',
        email: 'thuha@gmail.com',
        phone: '0912 345 678',
        address: 'Quận 7, TP.HCM',
        project: 'The Beverly Solari',
        subdivision: 'Vinhomes Grand Park',
        budget: '2 - 3 tỷ',
        score: 75,
        interestLevel: 'Tiềm năng',
        views: 8,
        docs: 2,
        behavior: 'Đã xem bảng giá',
        agent: 'Trần Minh Thư',
        status: 'Mới',
        source: 'Google Ads',
        createdAt: new Date(Date.now() - 120 * 60000).toISOString()
      },
      {
        id: 'lead-3',
        name: 'Nguyễn Quốc Duy',
        email: 'duy.nguyen@gmail.com',
        phone: '0934 567 890',
        address: 'Bình Thạnh, TP.HCM',
        project: 'Lumière Boulevard',
        subdivision: 'Vinhomes Grand Park',
        budget: '5 - 7 tỷ',
        score: 45,
        interestLevel: 'Tham khảo',
        views: 5,
        docs: 1,
        behavior: 'Đã xem dự án',
        agent: 'Lê Quốc Bảo',
        status: 'Mới',
        source: 'Tìm kiếm tự nhiên',
        createdAt: new Date(Date.now() - 360 * 60000).toISOString()
      },
      {
        id: 'lead-4',
        name: 'Phạm Thị Kim Oanh',
        email: 'oanh.pham@gmail.com',
        phone: '0987 654 321',
        address: 'Thủ Đức, TP.HCM',
        project: 'The Manhattan',
        subdivision: 'Vinhomes Grand Park',
        budget: '7 - 10 tỷ',
        score: 88,
        interestLevel: 'Lead nóng',
        views: 12,
        docs: 4,
        behavior: 'Đã dùng công cụ',
        agent: 'Nguyễn Hoàng',
        status: 'Đang tư vấn',
        source: 'Zalo',
        createdAt: new Date(Date.now() - 480 * 60000).toISOString()
      },
      {
        id: 'lead-5',
        name: 'Hoàng Văn Nam',
        email: 'nam.hoang@gmail.com',
        phone: '0976 543 210',
        address: 'Gò Vấp, TP.HCM',
        project: 'The Origami',
        subdivision: 'Vinhomes Grand Park',
        budget: '1.5 - 2.5 tỷ',
        score: 35,
        interestLevel: 'Tham khảo',
        views: 3,
        docs: 1,
        behavior: 'Đã xem bảng giá',
        agent: 'Trần Minh Thư',
        status: 'Mới',
        source: 'Khác',
        createdAt: new Date(Date.now() - 600 * 60000).toISOString()
      }
    ];

    this.leads.set(defaultMock);
    localStorage.setItem('pti_simulated_leads', JSON.stringify(defaultMock));
  }

  // Filtered Leads List
  filteredLeads = computed(() => {
    let list = this.leads();
    const query = this.searchQuery().toLowerCase().trim();
    const level = this.selectedLevel();
    const project = this.selectedProject();
    const source = this.selectedSource();
    const agent = this.selectedAgent();

    if (query) {
      list = list.filter(l => 
        l.name.toLowerCase().includes(query) ||
        l.phone.includes(query) ||
        l.email.toLowerCase().includes(query)
      );
    }

    if (level !== 'Tất cả') {
      list = list.filter(l => l.interestLevel === level);
    }

    if (project !== 'Tất cả') {
      list = list.filter(l => 
        l.project.toLowerCase().includes(project.toLowerCase()) || 
        (l.subdivision && l.subdivision.toLowerCase().includes(project.toLowerCase()))
      );
    }

    if (source !== 'Tất cả') {
      list = list.filter(l => l.source === source);
    }

    if (agent !== 'Tất cả') {
      list = list.filter(l => l.agent === agent);
    }

    return list;
  });

  // Pagination slices
  paginatedLeads = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredLeads().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => {
    return Math.max(1, Math.ceil(this.filteredLeads().length / this.pageSize));
  });

  // Global Statistics Cards Calculations
  totalCount = computed(() => this.leads().length);
  hotCount = computed(() => this.leads().filter(l => l.interestLevel === 'Lead nóng').length);
  potentialCount = computed(() => this.leads().filter(l => l.interestLevel === 'Tiềm năng').length);
  referenceCount = computed(() => this.leads().filter(l => l.interestLevel === 'Tham khảo').length);
  
  conversionRate = computed(() => {
    const total = this.leads().length;
    if (total === 0) return '0%';
    const converted = this.leads().filter(l => l.status === 'Đã cọc' || l.status === 'Đang tư vấn').length;
    return ((converted / total) * 100).toFixed(1) + '%';
  });

  // Chart Distribution Data
  levelDistribution = computed(() => {
    const total = this.filteredLeads().length;
    if (total === 0) return { hot: 0, potential: 0, reference: 0 };
    const hot = this.filteredLeads().filter(l => l.interestLevel === 'Lead nóng').length;
    const potential = this.filteredLeads().filter(l => l.interestLevel === 'Tiềm năng').length;
    const ref = this.filteredLeads().filter(l => l.interestLevel === 'Tham khảo').length;
    return {
      hot: Math.round((hot / total) * 100),
      potential: Math.round((potential / total) * 100),
      reference: Math.round((ref / total) * 100)
    };
  });

  scoreDistribution = computed(() => {
    const list = this.filteredLeads();
    const dist = { range1: 0, range2: 0, range3: 0, range4: 0, range5: 0 };
    list.forEach(l => {
      if (l.score <= 20) dist.range1++;
      else if (l.score <= 40) dist.range2++;
      else if (l.score <= 60) dist.range3++;
      else if (l.score <= 80) dist.range4++;
      else dist.range5++;
    });
    return dist;
  });

  sourceDistribution = computed(() => {
    const list = this.filteredLeads();
    const total = list.length;
    if (total === 0) return [];
    
    const counts: { [key: string]: number } = {};
    list.forEach(l => {
      counts[l.source] = (counts[l.source] || 0) + 1;
    });

    return Object.keys(counts).map(key => ({
      name: key,
      percentage: ((counts[key] / total) * 100).toFixed(1)
    })).sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
  });

  // Interactive Updates (Persisted to backend/local storage)
  updateLeadField(lead: Lead, field: keyof Lead, value: any): void {
    const updatedLead = { ...lead, [field]: value };
    
    // Nếu đổi mức độ quan tâm từ điểm số (hoặc ngược lại)
    if (field === 'interestLevel') {
      if (value === 'Lead nóng') updatedLead.score = Math.max(85, lead.score);
      else if (value === 'Tham khảo') updatedLead.score = Math.min(60, lead.score);
      else updatedLead.score = 75; // Tiềm năng
    }

    // 1. Cập nhật state cục bộ ngay lập tức để trải nghiệm mượt mà
    const updatedLeads = this.leads().map(l => l.id === lead.id ? updatedLead : l);
    this.leads.set(updatedLeads);

    // 2. Đồng bộ lên API Server
    fetch(`${this.API_URL}/${lead.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLead)
    })
    .then(res => {
      if (!res.ok) throw new Error('API save failed');
      return res.json();
    })
    .catch(err => {
      console.warn('API sync offline. Saving to simulated local storage.');
      localStorage.setItem('pti_simulated_leads', JSON.stringify(updatedLeads));
    });
  }

  // Action Triggers
  callCustomer(lead: Lead): void {
    alert(`Đang khởi tạo cuộc gọi đến ${lead.name} (${lead.phone}) qua hệ thống VoIP...`);
  }

  chatCustomer(lead: Lead): void {
    alert(`Đang mở cổng chat Zalo OA với ${lead.name}...`);
  }

  deleteLead(lead: Lead): void {
    if (!confirm(`Bạn có chắc chắn muốn xóa khách hàng ${lead.name} khỏi hệ thống?`)) return;

    const updatedLeads = this.leads().filter(l => l.id !== lead.id);
    this.leads.set(updatedLeads);

    fetch(`${this.API_URL}/${lead.id}`, {
      method: 'DELETE'
    })
    .catch(err => {
      localStorage.setItem('pti_simulated_leads', JSON.stringify(updatedLeads));
    });
  }

  exportReport(): void {
    alert('Báo cáo thống kê khách hàng tiềm năng đã được xuất thành công dưới định dạng PDF/Excel!');
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  getArcDashArray(score: number): string {
    return (score / 100 * 125.6) + ' 125.6';
  }

  getRequirement(behavior: string): string {
    if (!behavior) return 'Mua để ở';
    if (behavior.includes('Đầu tư')) return 'Mua để đầu tư';
    if (behavior.includes('Cho thuê')) return 'Cho thuê';
    if (behavior.includes('Mua để ở')) return 'Mua để ở';
    return 'Mua để ở';
  }

  getNote(behavior: string): string {
    if (!behavior) return 'Không có ghi chú';
    const parts = behavior.split('Ghi chú:');
    if (parts.length > 1) return parts[1].trim();
    return behavior;
  }

  selectLead(lead: Lead): void {
    this.selectedLead.set(lead);
    this.activeTab.set('overview');
    
    if (lead.chatHistory && lead.chatHistory.length > 0) {
      this.chatMessages.set(lead.chatHistory);
    } else {
      const defaultMsgs = [
        {
          sender: 'agent' as const,
          text: `Chào ${lead.name || 'anh/chị'}, PTI Home xin gửi thông tin về chính sách vay của dự án ${lead.project || 'quan tâm'} ạ.`,
          time: '13/05/2026 15:20'
        },
        {
          sender: 'client' as const,
          text: 'Cảm ơn bạn nhé, cho mình hỏi thêm về lãi suất sau ưu đãi ạ?',
          time: '13/05/2026 15:21'
        },
        {
          sender: 'agent' as const,
          text: `Dạ chính sách vay cụ thể em đính kèm file bên dưới để mình tham khảo nhé:`,
          time: '13/05/2026 15:22',
          file: { name: `Chính sách vay ${lead.project || 'Dự án'}.pdf`, size: '1.2 MB' }
        }
      ];
      this.chatMessages.set(defaultMsgs);
      lead.chatHistory = defaultMsgs;
    }
  }

  getInteractions(lead: Lead | null): { name: string; clicks: number; durationSeconds: number }[] {
    if (!lead || !lead.projectInteractions) return [];
    return Object.keys(lead.projectInteractions).map(proj => ({
      name: proj,
      clicks: lead.projectInteractions![proj].clicks || 0,
      durationSeconds: lead.projectInteractions![proj].durationSeconds || 0
    }));
  }

  getSortedInteractions(lead: Lead | null): { name: string; clicks: number; durationSeconds: number; score: number; percentage: number; rating: string }[] {
    const list = this.getInteractions(lead);
    if (list.length === 0) return [];
    
    const mapped = list.map(item => {
      const score = (item.clicks * 15) + (item.durationSeconds * 2);
      let rating = 'Thấp';
      if (score >= 120) {
        rating = 'Rất cao';
      } else if (score >= 60) {
        rating = 'Cao';
      } else if (score >= 20) {
        rating = 'Trung bình';
      }
      return {
        ...item,
        score,
        rating
      };
    });
    
    const maxScore = Math.max(...mapped.map(i => i.score)) || 1;
    
    return mapped.map(item => ({
      ...item,
      percentage: Math.min(100, Math.round((item.score / maxScore) * 100))
    })).sort((a, b) => b.score - a.score);
  }

  getMostInterestedProject(lead: Lead | null): { name: string; clicks: number; durationSeconds: number; score: number; rating: string } | null {
    const sorted = this.getSortedInteractions(lead);
    return sorted.length > 0 ? sorted[0] : null;
  }

  getTotalInteractionSummary(lead: Lead | null): { totalProjects: number; totalClicks: number; totalDuration: number } {
    const list = this.getInteractions(lead);
    return {
      totalProjects: list.length,
      totalClicks: list.reduce((sum, item) => sum + item.clicks, 0),
      totalDuration: list.reduce((sum, item) => sum + item.durationSeconds, 0)
    };
  }

  getInterestDonutData(lead: Lead | null): { name: string; percentage: number; color: string; score: number }[] {
    const list = this.getSortedInteractions(lead);
    const totalScore = list.reduce((sum, item) => sum + item.score, 0);
    if (totalScore === 0) return [];
    
    const colors = ['#972125', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    return list.map((item, idx) => {
      const percentage = Math.round((item.score / totalScore) * 100);
      return {
        name: item.name,
        percentage,
        color: colors[idx % colors.length],
        score: item.score
      };
    });
  }

  getDonutGradientStyle(lead: Lead | null): string {
    const data = this.getInterestDonutData(lead);
    if (data.length === 0) {
      return 'conic-gradient(#cbd5e1 0% 100%)';
    }
    let accum = 0;
    const parts = data.map(item => {
      const start = accum;
      const end = accum + item.percentage;
      accum = end;
      return `${item.color} ${start}% ${end}%`;
    });
    if (accum < 100) {
      parts.push(`#cbd5e1 ${accum}% 100%`);
    }
    return `conic-gradient(${parts.join(', ')})`;
  }

  backToList(): void {
    this.selectedLead.set(null);
  }

  sendChatMessage(): void {
    const text = this.newChatMessage().trim();
    if (!text) return;
    
    const now = new Date();
    const time = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const newMsg = { sender: 'agent' as const, text, time };
    
    this.chatMessages.update(msgs => [...msgs, newMsg]);
    this.newChatMessage.set('');

    const lead = this.selectedLead();
    if (lead) {
      const updatedHistory = [...(lead.chatHistory || []), newMsg];
      lead.chatHistory = updatedHistory;
      this.updateLeadField(lead, 'chatHistory', updatedHistory);
    }
  }
}
