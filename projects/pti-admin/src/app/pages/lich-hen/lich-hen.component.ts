import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  project: string;
  subdivision: string;
  budget: string;
  agent: string;
  behavior: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  source: string;
  createdAt: string;
}

@Component({
  selector: 'app-lich-hen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lich-hen.component.html',
  styleUrl: './lich-hen.component.scss'
})
export class LichHenComponent implements OnInit, OnDestroy {
  private readonly API_URL = 'http://localhost:3000/api/leads';

  appointments = signal<Appointment[]>([]);
  isLoading = signal(true);
  isOffline = signal(false);
  private pollingIntervalId: any;

  // Filter signals
  searchQuery = signal<string>('');
  filterProject = signal<string>('');
  filterTime = signal<string>('');
  filterBudget = signal<string>('');

  // Filtered Appointments
  filteredAppointments = computed(() => {
    let list = this.appointments();

    // 1. Search Query (name, phone, email)
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      list = list.filter(app => 
        (app.name && app.name.toLowerCase().includes(query)) ||
        (app.phone && app.phone.includes(query)) ||
        (app.email && app.email.toLowerCase().includes(query))
      );
    }

    // 2. Filter Project
    const proj = this.filterProject();
    if (proj) {
      list = list.filter(app => app.project === proj);
    }

    // 3. Filter Time / Date
    const timeVal = this.filterTime();
    if (timeVal) {
      const today = new Date();
      const d = String(today.getDate()).padStart(2, '0');
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const y = today.getFullYear();
      const todayFormatted = `${d}/${m}/${y}`;

      if (timeVal === 'today') {
        list = list.filter(app => app.appointmentDate && (app.appointmentDate.includes('Hôm nay') || app.appointmentDate.includes(todayFormatted)));
      } else if (timeVal === 'upcoming') {
        list = list.filter(app => app.status === 'Mới' || app.status === 'Đang tư vấn');
      } else if (timeVal === 'past') {
        list = list.filter(app => app.status === 'Đã tư vấn' || app.status === 'Đã cọc');
      }
    }

    // 4. Filter Budget
    const budgetVal = this.filterBudget();
    if (budgetVal) {
      const normalize = (s: string) => s.replace(/\s+/g, '').replace(/–/g, '-').toLowerCase();
      list = list.filter(app => app.budget && normalize(app.budget) === normalize(budgetVal));
    }

    return list;
  });
  
  // Statistical signals
  totalCount = computed(() => this.appointments().length);
  
  todayCount = computed(() => {
    const today = new Date();
    const d = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    const todayFormatted = `${d}/${m}/${y}`;
    return this.appointments().filter(app => 
      app.appointmentDate && (app.appointmentDate.includes('Hôm nay') || app.appointmentDate.includes(todayFormatted))
    ).length;
  });
  
  waitingCount = computed(() => {
    return this.appointments().filter(app => app.status === 'Mới' || app.status === 'Đang tư vấn').length;
  });

  doneCount = computed(() => {
    return this.appointments().filter(app => app.status === 'Đã cọc').length;
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchAppointments();
    // Tự động tải lại mỗi 5 giây để đồng bộ thời gian thực từ Mock API Server
    this.pollingIntervalId = setInterval(() => this.fetchAppointments(false), 5000);
  }

  ngOnDestroy(): void {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
    }
  }

  fetchAppointments(showLoader = true): void {
    if (showLoader) {
      this.isLoading.set(true);
    }
    fetch(this.API_URL)
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((leads: any[]) => {
        const allApps: Appointment[] = [];
        leads.forEach((l: any) => {
          if (l.appointments && l.appointments.length > 0) {
            l.appointments.forEach((app: any) => {
              allApps.push({
                id: app.id,
                name: l.name,
                phone: l.phone,
                email: l.email || '',
                project: app.project || l.project || 'Chưa chọn',
                subdivision: l.subdivision || 'Chưa rõ',
                budget: l.budget || 'Chưa rõ',
                agent: app.agent || l.agent || 'Nguyễn Hoàng',
                behavior: `Đặt lịch khảo sát dự án ${app.project || l.project || 'Chưa chọn'} - ${app.appointmentDate} (${app.appointmentTime})`,
                appointmentDate: app.appointmentDate,
                appointmentTime: app.appointmentTime,
                status: app.status || 'Mới',
                source: l.source || 'Website',
                createdAt: app.createdAt || l.createdAt || new Date().toISOString()
              });
            });
          } else if (l.appointmentDate && l.appointmentTime) {
            // Fallback for old single appointment format
            allApps.push({
              id: l.id,
              name: l.name,
              phone: l.phone,
              email: l.email || '',
              project: l.project,
              subdivision: l.subdivision || 'Chưa rõ',
              budget: l.budget || 'Chưa rõ',
              agent: l.agent || 'Nguyễn Hoàng',
              behavior: l.behavior || `Đặt lịch khảo sát dự án ${l.project || 'Chưa chọn'} - ${l.appointmentDate} (${l.appointmentTime})`,
              appointmentDate: l.appointmentDate,
              appointmentTime: l.appointmentTime,
              status: l.status || 'Mới',
              source: l.source || 'Website',
              createdAt: l.createdAt || new Date().toISOString()
            });
          }
        });

        // Sort by createdAt descending
        allApps.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

        this.appointments.set(allApps);
        this.isOffline.set(false);
        if (showLoader) {
          this.isLoading.set(false);
        }
      })
      .catch((err) => {
        console.warn('Backend server offline. Displaying empty appointments list:', err);
        this.appointments.set([]);
        this.isOffline.set(true);
        if (showLoader) {
          this.isLoading.set(false);
        }
      });
  }

  getMockAppointments(): Appointment[] {
    return [
      {
        id: 'mock-1',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        email: 'vana@gmail.com',
        project: 'Eaton Park',
        subdivision: 'TP. Hồ Chí Minh',
        budget: '5 – 10 tỷ',
        agent: 'Lê Quốc Bảo',
        behavior: 'Cần tư vấn căn 2 phòng ngủ hướng Đông Nam',
        appointmentDate: 'Hôm nay',
        appointmentTime: 'Sáng: 08:30 - 10:30',
        status: 'Mới',
        source: 'Zalo',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-2',
        name: 'Trần Thị B',
        phone: '0912345678',
        email: 'thib@gmail.com',
        project: 'Masteri Centre Point',
        subdivision: 'TP. Hồ Chí Minh',
        budget: '2 – 5 tỷ',
        agent: 'Nguyễn Hoàng',
        behavior: 'Quan tâm chính sách thanh toán giãn tiến độ',
        appointmentDate: 'Thứ Tư, 27/05/2026',
        appointmentTime: 'Chiều: 14:00 - 16:00',
        status: 'Đang tư vấn',
        source: 'Website',
        createdAt: new Date().toISOString()
      },
      {
        id: 'mock-3',
        name: 'Lê Văn C',
        phone: '0923456789',
        email: 'vanc@gmail.com',
        project: 'The Seahorse Central',
        subdivision: 'Bình Phước',
        budget: 'Dưới 2 tỷ',
        agent: 'Trần Minh Thư',
        behavior: 'Đăng ký tham quan thực tế dự án cuối tuần',
        appointmentDate: 'Thứ Năm, 28/05/2026',
        appointmentTime: 'Sáng: 08:30 - 10:30',
        status: 'Đã cọc',
        source: 'Facebook Ads',
        createdAt: new Date().toISOString()
      }
    ];
  }

  updateAppointmentStatus(app: Appointment, newStatus: string): void {
    app.status = newStatus;
    
    fetch(`${this.API_URL}/appointments/${app.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
    .then(() => {
      this.appointments.set([...this.appointments()]);
    })
    .catch(err => console.warn('Could not update status on server:', err));
  }

  updateAppointmentAgent(app: Appointment, newAgent: string): void {
    app.agent = newAgent;
    
    fetch(`${this.API_URL}/appointments/${app.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ agent: newAgent })
    })
    .then(() => {
      this.appointments.set([...this.appointments()]);
    })
    .catch(err => console.warn('Could not update agent on server:', err));
  }

  deleteAppointment(id: string): void {
    if (!confirm('Bạn có chắc chắn muốn xóa lịch hẹn này không?')) return;

    fetch(`${this.API_URL}/appointments/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      this.appointments.set(this.appointments().filter(a => a.id !== id));
    })
    .catch(err => {
      console.warn('Could not delete appointment on server:', err);
      // Local fallback delete
      this.appointments.set(this.appointments().filter(a => a.id !== id));
    });
  }

  navigateToChat(phone: string): void {
    // Navigate to crm component chat room
    this.router.navigate(['/crm']);
  }
}
