import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
Chart.defaults.font.family = "'Montserrat', sans-serif";

@Component({
  selector: 'app-investment-tool',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './investment-tool.component.html',
  styleUrl: './investment-tool.component.scss',
})
export class InvestmentToolComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chatBody') chatBodyRef!: ElementRef;

  isAnalyzed: boolean = false;
  isAnalyzing: boolean = false;
  isChatOpen: boolean = true;
  isAiTyping: boolean = false;

  // Chat state
  messages: { sender: 'ai'|'user', text: string, time: string, isTyping?: boolean }[] = [];
  currentQuestionIndex: number = 0;
  userInput: string = '';
  
  // Available options for the current question
  currentOptions: { label: string, value: string }[] = [];

  // Form selections
  goal: string = '';
  budget: string = '';
  timeframe: string = '';
  location: string = '';
  propertyType: string = '';
  
  topProject: any = {};

  analysisChart: any;

  // Project Data loaded from JSON
  projects: any[] = [];

  // Question flow
  questions = [
    { text: "Xin chào! Tôi là trợ lý AI của PTI Home.<br>Trước tiên, bạn đang có mục tiêu đầu tư như thế nào?", 
      options: [
        { label: 'Đầu tư sinh lời', value: 'Sinh lời' },
        { label: 'Mua để ở', value: 'Để ở' },
        { label: 'Cho thuê', value: 'Cho thuê' },
        { label: 'Tích lũy dài hạn', value: 'Tích lũy' }
      ]
    },
    { text: "Ngân sách dự kiến của bạn là bao nhiêu?",
      options: [
        { label: 'Dưới 2 tỷ', value: 'Dưới 2 tỷ' },
        { label: '2 - 5 tỷ', value: '2 - 5 tỷ' },
        { label: '5 - 10 tỷ', value: '5 - 10 tỷ' },
        { label: 'Trên 10 tỷ', value: 'Trên 10 tỷ' }
      ]
    },
    { text: "Thời gian dự kiến đầu tư của bạn?",
      options: [
        { label: 'Dưới 1 năm', value: 'Dưới 1 năm' },
        { label: '1 - 3 năm', value: '1 - 3 năm' },
        { label: '3 - 5 năm', value: '3 - 5 năm' },
        { label: 'Trên 5 năm', value: 'Trên 5 năm' }
      ]
    },
    { text: "Bạn quan tâm đến khu vực nào?",
      options: [
        { label: 'TP. Thủ Đức', value: 'TP. Thủ Đức' },
        { label: 'Quận 7', value: 'Quận 7' },
        { label: 'Bình Chánh', value: 'Bình Chánh' },
        { label: 'Nhà Bè', value: 'Nhà Bè' },
        { label: 'Hóc Môn', value: 'Hóc Môn' },
        { label: 'Khác', value: 'Khác' }
      ]
    },
    { text: "Bạn ưu tiên loại hình bất động sản nào?",
      options: [
        { label: 'Căn hộ', value: 'Căn hộ' },
        { label: 'Nhà phố', value: 'Nhà phố' },
        { label: 'Shophouse', value: 'Shophouse' },
        { label: 'Biệt thự', value: 'Biệt thự' }
      ]
    }
  ];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<any[]>('/assets/data/projects.json').subscribe(data => {
      this.projects = data;
    });
    this.askNextQuestion();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.analysisChart) this.analysisChart.destroy();
  }

  getTime() {
    const d = new Date();
    return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
  }

  askNextQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      const q = this.questions[this.currentQuestionIndex];
      this.messages.push({ sender: 'ai', text: q.text, time: this.getTime() });
      this.currentOptions = q.options;
      this.currentQuestionIndex++;
      this.scrollToBottom();
    } else {
      this.currentOptions = [];
      this.messages.push({ sender: 'ai', text: "AI đã thu thập đủ thông tin. Bạn có muốn bắt đầu phân tích ngay?", time: this.getTime() });
      this.scrollToBottom();
    }
  }

  selectOption(opt: {label: string, value: string}) {
    // Save to variables
    if (this.currentQuestionIndex === 1) this.goal = opt.value;
    else if (this.currentQuestionIndex === 2) this.budget = opt.value;
    else if (this.currentQuestionIndex === 3) this.timeframe = opt.value;
    else if (this.currentQuestionIndex === 4) this.location = opt.value;
    else if (this.currentQuestionIndex === 5) this.propertyType = opt.value;

    // Clear current options
    this.currentOptions = [];
    
    // Add user message
    this.messages.push({ sender: 'user', text: opt.label, time: this.getTime() });
    this.scrollToBottom();

    // Ask next question immediately
    this.askNextQuestion();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatBodyRef?.nativeElement) {
        this.chatBodyRef.nativeElement.scrollTop = this.chatBodyRef.nativeElement.scrollHeight;
      } else {
        const body = document.querySelector('.chat-body');
        if (body) body.scrollTop = body.scrollHeight;
      }
    }, 80);
  }

  async sendMessage() {
    const text = this.userInput.trim();
    if (!text || this.isAiTyping) return;

    // Check if user is answering a questionnaire step with custom text
    const wasAnsweringQuestion = this.currentOptions.length > 0;
    if (wasAnsweringQuestion) {
      if (this.currentQuestionIndex === 1) this.goal = text;
      else if (this.currentQuestionIndex === 2) this.budget = text;
      else if (this.currentQuestionIndex === 3) this.timeframe = text;
      else if (this.currentQuestionIndex === 4) this.location = text;
      else if (this.currentQuestionIndex === 5) this.propertyType = text;
    }

    // Add user message
    this.messages.push({ sender: 'user', text, time: this.getTime() });
    this.userInput = '';
    this.currentOptions = [];
    this.scrollToBottom();

    // Show typing indicator
    this.isAiTyping = true;
    this.messages.push({ sender: 'ai', text: '', time: this.getTime(), isTyping: true });
    this.scrollToBottom();

    try {
      const apiKey = 'AIzaSyDemo_key_replace_me';
      const context = `Bạn là trợ lý AI tư vấn đầu tư bất động sản của PTI Home - một công ty bất động sản uy tín tại TP.HCM. 
      Thông tin khách hàng hiện tại: Mục tiêu=${this.goal || 'chưa rõ'}, Ngân sách=${this.budget || 'chưa rõ'}, Thời gian=${this.timeframe || 'chưa rõ'}, Khu vực=${this.location || 'chưa rõ'}, Loại hình=${this.propertyType || 'chưa rõ'}.
      Hãy trả lời ngắn gọn, thực tế, hữu ích bằng tiếng Việt. ${wasAnsweringQuestion ? 'Hãy ghi nhận câu trả lời của khách hàng bằng 1 câu ngắn gọn và không hỏi lại các câu hỏi mà hệ thống đang tự động hỏi.' : 'Tập trung vào thị trường BĐS TP.HCM và các tỉnh lân cận.'}`;

      let aiText = '';
      if (apiKey === 'AIzaSyDemo_key_replace_me') {
        await new Promise(resolve => setTimeout(resolve, 300));
        throw new Error('Fake API Key');
      } else {
        const response = await firstValueFrom(this.http.post<any>(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            contents: [{ parts: [{ text: `${context}\n\nKhách hàng nói: ${text}` }] }]
          },
          { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
        ));
        aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      }

      aiText = aiText || this.getSmartReply(text, wasAnsweringQuestion);
      this.messages.pop();
      this.messages.push({ sender: 'ai', text: aiText, time: this.getTime() });
    } catch {
      // Fallback to smart local responses
      this.messages.pop();
      this.messages.push({ sender: 'ai', text: this.getSmartReply(text, wasAnsweringQuestion), time: this.getTime() });
    }

    this.isAiTyping = false;
    this.scrollToBottom();

    if (wasAnsweringQuestion) {
      setTimeout(() => {
        this.askNextQuestion();
      }, 1000);
    }
  }

  getSmartReply(question: string, isAnswering: boolean = false): string {
    if (isAnswering) {
      return `Đã ghi nhận thông tin: "${question}". Tôi sẽ lưu ý điều này cho phân tích sau.`;
    }
    const q = question.toLowerCase();
    if (q.includes('giá') || q.includes('giá tiền') || q.includes('bao nhiêu')) {
      return `Dựa trên thông tin của bạn (ngân sách ${this.budget || '...'}, khu vực ${this.location || '...'}), tôi gợi ý:<br><br>
      🏠 <strong>TP. Thủ Đức</strong>: 2.5 - 4.5 tỷ/căn hộ 2PN<br>
      🏠 <strong>Quận 7</strong>: 3 - 6 tỷ/căn hộ 2PN<br>
      🏠 <strong>Bình Chánh</strong>: 1.8 - 3 tỷ/nhà phố<br><br>
      Bạn muốn tôi tư vấn chi tiết khu vực nào?`;
    } else if (q.includes('sinh lời') || q.includes('lợi nhuận') || q.includes('lãi')) {
      return `Với mục tiêu <strong>sinh lời</strong>, các kênh hiệu quả nhất hiện tại:<br><br>
      📈 <strong>Căn hộ cho thuê</strong>: lợi suất 4-6%/năm + tăng giá 10-15%/năm<br>
      📈 <strong>Shophouse</strong>: lợi suất cho thuê 5-8%/năm<br>
      📈 <strong>Đất nền</strong>: tăng giá 15-25%/năm tại khu vực mới phát triển<br><br>
      Bạn muốn tìm hiểu thêm loại hình nào?`;
    } else if (q.includes('thuê') || q.includes('cho thuê')) {
      return `Để đầu tư cho thuê hiệu quả, bạn nên chú ý:<br><br>
      ✅ Vị trí gần trường đại học, KCN, bệnh viện<br>
      ✅ Tỷ suất cho thuê mục tiêu: >5%/năm<br>
      ✅ <strong>TP. Thủ Đức</strong> hiện là điểm nóng với lực cầu thuê cao<br><br>
      Dự án phù hợp: Vinhomes Grand Park, The Beverly Solari`;
    } else if (q.includes('dự án') || q.includes('nên mua') || q.includes('gợi ý')) {
      return `Dựa trên nhu cầu của bạn, tôi gợi ý top dự án phù hợp:<br><br>
      🏆 <strong>Vinhomes Grand Park</strong> - Hóc Môn: 2.8 tỷ, tăng trưởng 18.7%<br>
      🏆 <strong>The Beverly Solari</strong> - TP. Thủ Đức: 3.2 tỷ, tăng trưởng 16.3%<br>
      🏆 <strong>Lumière Boulevard</strong> - TP. Thủ Đức: 4.5 tỷ, tăng trưởng 15.8%<br><br>
      Muốn xem phân tích chi tiết dự án nào?`;
    } else {
      return `Cảm ơn câu hỏi của bạn! 😊<br><br>
      Với kinh nghiệm tư vấn BĐS tại TP.HCM, tôi có thể hỗ trợ bạn về:<br>
      • Phân tích thị trường theo khu vực<br>
      • So sánh các dự án phù hợp<br>
      • Tính toán lợi nhuận đầu tư<br>
      • Tư vấn vay vốn ngân hàng<br><br>
      Bạn có thể hỏi cụ thể hơn để tôi hỗ trợ tốt nhất!`;
    }
  }

  analyze() {
    this.isAnalyzing = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.isAnalyzing = false;
      this.isAnalyzed = true;
      
      // Filter projects by selected location if possible
      let filtered = this.projects;
      if (this.location && this.location !== 'Khác') {
         const locFiltered = this.projects.filter(p => p.loc.toLowerCase().includes(this.location.toLowerCase()));
         if (locFiltered.length > 0) {
           filtered = locFiltered;
         }
      }
      
      const randomIndex = Math.floor(Math.random() * filtered.length);
      this.topProject = { ...filtered[randomIndex], match_score: Math.floor(Math.random() * 14) + 85 };
      
      this.cdr.detectChanges();
      setTimeout(() => {
        this.initAnalysisChart();
      }, 100);
    }, 1000); // 1 second mock loading
  }

  reset() {
    this.isAnalyzed = false;
    this.isAnalyzing = false;
    this.currentQuestionIndex = 0;
    this.messages = [];
    this.goal = '';
    this.budget = '';
    this.timeframe = '';
    this.location = '';
    this.propertyType = '';
    this.askNextQuestion();
  }

  initAnalysisChart() {
    if (this.analysisChart) this.analysisChart.destroy();
    const ctx = document.getElementById('analysisChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    this.analysisChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Hiện tại', 'Năm 1', 'Năm 2', 'Năm 3', 'Năm 4', 'Năm 5'],
        datasets: [
          {
            label: this.topProject?.name || 'Dự án nổi bật',
            data: [0, 5, 8, 12, 15, parseFloat(this.topProject?.growth?.replace(/[^\d.]/g, '') || '18.7')],
            borderColor: '#cc0000',
            backgroundColor: '#cc0000',
            tension: 0.3
          },
          {
            label: 'Khu vực ' + (this.location || 'TP. Thủ Đức'),
            data: [0, 3, 6, 8, 10, parseFloat(this.topProject?.growth?.replace(/[^\d.]/g, '') || '18.7') * 0.6],
            borderColor: '#888',
            backgroundColor: '#888',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            ticks: { callback: function(value) { return value + '%'; } }
          }
        }
      }
    });
  }
}
