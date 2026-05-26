import { Component, OnInit, signal, computed } from '@angular/core';
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
export class LichHenComponent implements OnInit {
  private readonly API_URL = 'http://localhost:3000/api/leads';

  appointments = signal<Appointment[]>([]);
  isLoading = signal(true);
  
  // Statistical signals
  totalCount = computed(() => this.appointments().length);
  
  todayCount = computed(() => {
    return this.appointments().filter(app => app.appointmentDate.includes('Hôm nay')).length;
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
  }

  fetchAppointments(): void {
    this.isLoading.set(true);
    fetch(this.API_URL)
      .then(res => res.json())
      .then((leads: any[]) => {
        // Filter leads that have appointment details
        let filtered = leads.filter(l => l.appointmentDate && l.appointmentTime);
        
        // Fallback mock appointments if database is empty
        if (filtered.length === 0) {
          filtered = this.getMockAppointments();
        }
        
        this.appointments.set(filtered);
        this.isLoading.set(false);
      })
      .catch(() => {
        this.appointments.set(this.getMockAppointments());
        this.isLoading.set(false);
      });
  }

  getMockAppointments(): Appointment[] {
    return [
      {
        id: 'app-1',
        name: 'Nguyễn Văn Hải',
        phone: '0912 888 999',
        email: 'hai.nguyen@gmail.com',
        project: 'Vinhomes Saigon Park',
        subdivision: 'TP. Hồ Chí Minh',
        budget: '2 - 5 tỷ',
        agent: 'Nguyễn Hoàng',
        behavior: 'Khảo sát: Nhu cầu Đầu tư. Ghi chú: Cần căn hướng Đông Nam',
        appointmentDate: 'Hôm nay',
        appointmentTime: 'Sáng: 08:30 - 10:30',
        status: 'Đang tư vấn',
        source: 'Zalo',
        createdAt: new Date().toISOString()
      },
      {
        id: 'app-2',
        name: 'Phạm Thanh Thủy',
        phone: '0987 555 444',
        email: 'thuypham@gmail.com',
        project: 'Dự Án The Felix',
        subdivision: 'Bình Dương',
        budget: 'Dưới 2 tỷ',
        agent: 'Phạm Mai',
        behavior: 'Khảo sát: Nhu cầu Mua để ở. Ghi chú: Muốn nhận bảng tính vay ngân hàng',
        appointmentDate: 'Thứ Tư, 27/05/2026',
        appointmentTime: 'Chiều: 14:00 - 16:00',
        status: 'Mới',
        source: 'Zalo',
        createdAt: new Date().toISOString()
      },
      {
        id: 'app-3',
        name: 'Đặng Quốc Bảo',
        phone: '0909 333 222',
        email: 'baodang@gmail.com',
        project: 'Gold Coast Vũng Tàu',
        subdivision: 'Vũng Tàu',
        budget: '5 - 10 tỷ',
        agent: 'Trần Văn Nam',
        behavior: 'Khảo sát: Nhu cầu Cho thuê. Ghi chú: Xem trực tiếp nhà mẫu',
        appointmentDate: 'Thứ Năm, 28/05/2026',
        appointmentTime: 'Sáng: 08:30 - 10:30',
        status: 'Mới',
        source: 'Zalo',
        createdAt: new Date().toISOString()
      }
    ];
  }

  updateAppointmentStatus(app: Appointment, newStatus: string): void {
    app.status = newStatus;
    
    // Update backend API
    fetch(`${this.API_URL}/${app.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
    .then(() => {
      // Trigger change detection
      this.appointments.set([...this.appointments()]);
    })
    .catch(err => console.warn('Could not update status on server:', err));
  }

  updateAppointmentAgent(app: Appointment, newAgent: string): void {
    app.agent = newAgent;
    
    fetch(`${this.API_URL}/${app.id}`, {
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

    fetch(`${this.API_URL}/${id}`, {
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
