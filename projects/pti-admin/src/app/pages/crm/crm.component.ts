import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChatMessage {
  sender: 'client' | 'agent';
  text: string;
  time: string;
}

interface ChatSession {
  leadId: string;
  clientName: string;
  clientPhone: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: boolean;
  messages: ChatMessage[];
}

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crm.component.html',
  styleUrl: './crm.component.scss'
})
export class CrmComponent implements OnInit {
  private readonly API_URL = 'http://localhost:3000/api/leads';

  sessions = signal<ChatSession[]>([]);
  selectedSession = signal<ChatSession | null>(null);
  newMessageText = '';
  isTyping = signal(false);

  ngOnInit(): void {
    this.fetchChatLeads();
  }

  fetchChatLeads(): void {
    fetch(this.API_URL)
      .then(res => res.json())
      .then((leads: any[]) => {
        this.initializeChatSessions(leads);
      })
      .catch(() => {
        // Fallback mock leads
        const mockLeads = [
          { id: 'lead-1', name: 'Trần Minh Đức', phone: '0901 234 567', project: 'Vinhomes Grand Park' },
          { id: 'lead-2', name: 'Lê Thị Thu Hà', phone: '0912 345 678', project: 'The Beverly Solari' },
          { id: 'lead-3', name: 'Nguyễn Quốc Duy', phone: '0934 567 890', project: 'Lumière Boulevard' },
        ];
        this.initializeChatSessions(mockLeads);
      });
  }

  initializeChatSessions(leads: any[]): void {
    const chatSessions: ChatSession[] = leads.map((lead, idx) => {
      // Default pre-populated chat history
      const messages: ChatMessage[] = [
        { sender: 'client', text: `Xin chào, tôi cần tư vấn thêm về dự án ${lead.project || 'Vinhomes Saigon Park'}.`, time: '10:05' },
        { sender: 'agent', text: `Chào anh/chị ${lead.name}, em là chuyên viên tư vấn tại PTI Home. Rất vui được hỗ trợ anh/chị ạ!`, time: '10:06' },
        { sender: 'client', text: `Tôi quan tâm phân khúc căn hộ tầm trung, vui lòng gửi giúp tôi bảng giá chi tiết nhé.`, time: '10:08' }
      ];

      return {
        leadId: lead.id,
        clientName: lead.name,
        clientPhone: lead.phone,
        avatar: `https://ui-avatars.com/api/?name=${lead.name}&background=f1f5f9&color=972125&rounded=true`,
        lastMessage: messages[messages.length - 1].text,
        lastTime: messages[messages.length - 1].time,
        unread: idx === 0, // Mark the first one as unread for visual interest
        messages: messages
      };
    });

    this.sessions.set(chatSessions);
    if (chatSessions.length > 0) {
      this.selectedSession.set(chatSessions[0]);
    }
  }

  selectSession(session: ChatSession): void {
    session.unread = false;
    this.selectedSession.set(session);
  }

  sendMessage(): void {
    const text = this.newMessageText.trim();
    const activeSession = this.selectedSession();
    if (!text || !activeSession) return;

    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    // Add agent message
    const msg: ChatMessage = { sender: 'agent', text, time };
    activeSession.messages.push(msg);
    activeSession.lastMessage = text;
    activeSession.lastTime = time;
    
    this.newMessageText = '';

    // Simulate customer typing after 1 second
    this.isTyping.set(true);
    setTimeout(() => {
      this.isTyping.set(false);
      
      const responses = [
        "Cảm ơn thông tin của bạn. Cho tôi hỏi thêm về tiến độ thanh toán của dự án này thế nào?",
        "Bảng giá này đã bao gồm thuế VAT và kinh phí bảo trì chưa bạn?",
        "Tôi muốn đăng ký đi xem nhà mẫu vào cuối tuần này, bạn sắp xếp lịch giúp tôi nhé.",
        "Dự án này ngân hàng nào hỗ trợ cho vay vậy em? Lãi suất thế nào?",
        "Ok em, gửi thêm cho anh sơ đồ mặt bằng chi tiết của căn hộ này nhé."
      ];
      
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      const replyTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      
      const replyMsg: ChatMessage = { sender: 'client', text: randomReply, time: replyTime };
      activeSession.messages.push(replyMsg);
      activeSession.lastMessage = randomReply;
      activeSession.lastTime = replyTime;
      
      // Update session array to trigger change detection
      this.sessions.set([...this.sessions()]);
    }, 2000);
  }
}
