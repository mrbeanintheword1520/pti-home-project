const http = require('http');
const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(__dirname, 'leads.json');
const PORT = 3000;

// Bộ dữ liệu mẫu ban đầu theo hình ảnh của khách hàng
const initialLeads = [
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
    createdAt: new Date(Date.now() - 30 * 60000).toISOString() // 30 phút trước
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
    agent: 'Phạm Mai',
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
    agent: 'Trần Văn Nam',
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
    agent: 'Phạm Mai',
    status: 'Mới',
    source: 'Khác',
    createdAt: new Date(Date.now() - 600 * 60000).toISOString()
  }
];

function readLeads() {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(initialLeads, null, 2), 'utf-8');
      return initialLeads;
    }
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leads file:', error);
    return initialLeads;
  }
}

function writeLeads(leads) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing leads file:', error);
  }
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  if (pathname === '/api/leads') {
    const leads = readLeads();

    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(leads));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const clientData = JSON.parse(body);
          
          // Tạo một Lead mới dựa trên dữ liệu gửi từ client
          const score = Math.floor(Math.random() * 41) + 55; // 55 - 95
          let interestLevel = 'Tiềm năng';
          if (score >= 85) interestLevel = 'Lead nóng';
          else if (score < 65) interestLevel = 'Tham khảo';

          const newLead = {
            id: `lead-${Date.now()}`,
            name: clientData.name || 'Khách hàng ẩn danh',
            email: clientData.email || '',
            phone: clientData.phone,
            address: clientData.address || 'Đang cập nhật',
            project: clientData.project || 'Vinhomes Saigon Park',
            subdivision: clientData.subdivision || 'Phân khu A',
            budget: clientData.budget || 'Chưa cập nhật',
            score: score,
            interestLevel: interestLevel,
            views: 1,
            docs: 0,
            behavior: clientData.behavior || 'Đã truy cập trang',
            agent: clientData.agent || 'Nguyễn Hoàng',
            status: 'Mới',
            source: clientData.source || 'Facebook Ads',
            appointmentDate: clientData.appointmentDate || '',
            appointmentTime: clientData.appointmentTime || '',
            createdAt: new Date().toISOString()
          };

          leads.unshift(newLead);
          writeLeads(leads);

          res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(newLead));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON data' }));
        }
      });
    }
  } else if (pathname.startsWith('/api/leads/')) {
    const leads = readLeads();
    const leadId = pathname.split('/').pop();
    const leadIndex = leads.findIndex(l => l.id === leadId);

    if (leadIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Lead not found' }));
      return;
    }

    if (req.method === 'PUT') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const updateData = JSON.parse(body);
          leads[leadIndex] = {
            ...leads[leadIndex],
            ...updateData
          };
          writeLeads(leads);

          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(leads[leadIndex]));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON data' }));
        }
      });
    } else if (req.method === 'DELETE') {
      leads.splice(leadIndex, 1);
      writeLeads(leads);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Mock API Server is running on http://localhost:${PORT}`);
});
