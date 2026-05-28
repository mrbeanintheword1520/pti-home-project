const http = require('http');
const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(__dirname, 'leads.json');
const PORT = 3000;

// Bộ dữ liệu mẫu ban đầu theo hình ảnh của khách hàng
const initialLeads = [
  {
    "id": "lead-1779866120916",
    "name": "Linh",
    "email": "linh@gmail.com",
    "phone": "0999999999",
    "address": "Đang cập nhật",
    "project": "The SeaHorse Central Bình Phước",
    "subdivision": "Bình Phước",
    "budget": "5 – 10 tỷ",
    "score": 61,
    "interestLevel": "Tham khảo",
    "views": 1,
    "docs": 0,
    "behavior": "Khảo sát: Nhu cầu Đầu tư. Ghi chú: Nhận tư vấn",
    "agent": "Lê Quốc Bảo",
    "status": "Mới",
    "source": "Zalo",
    "appointmentDate": "Thứ Hai, 01/06/2026",
    "appointmentTime": "Sáng: 08:30 - 10:30",
    "createdAt": "2026-05-27T07:15:20.916Z",
    "chatHistory": [
      {
        "sender": "agent",
        "text": "xin chào",
        "time": "27/5/2026 14:46"
      }
    ]
  },
  {
    "id": "lead-1779865445910",
    "name": "Xuân",
    "email": "xuan@gmail.com",
    "phone": "0979797979",
    "address": "Đang cập nhật",
    "project": "Dự Án The Felix",
    "subdivision": "Bình Dương",
    "budget": "5 – 10 tỷ",
    "score": 86,
    "interestLevel": "Lead nóng",
    "views": 1,
    "docs": 0,
    "behavior": "Khảo sát: Nhu cầu Mua để ở. Ghi chú: Mua nhà cho con gái lấy chồng",
    "agent": "Trần Minh Thư",
    "status": "Mới",
    "source": "Zalo",
    "appointmentDate": "Chủ Nhật, 31/05/2026",
    "appointmentTime": "Sáng: 08:30 - 10:30",
    "createdAt": "2026-05-27T07:04:05.910Z"
  },
  {
    "id": "lead-1779864805901",
    "name": "Linh Xuân",
    "email": "khanhbinh@gmail.com",
    "phone": "0866866866",
    "address": "Đang cập nhật",
    "project": "Dự Án The Infinity Dĩ An",
    "subdivision": "Bình Dương",
    "budget": "5 – 10 tỷ",
    "score": 86,
    "interestLevel": "Lead nóng",
    "views": 1,
    "docs": 0,
    "behavior": "Khảo sát: Nhu cầu Cho thuê. Ghi chú: Tư vấn mua nhà cho Điêu Thuyền",
    "agent": "Lê Quốc Bảo",
    "status": "Mới",
    "source": "Zalo",
    "appointmentDate": "Thứ Bảy, 30/05/2026",
    "appointmentTime": "Chiều: 14:00 - 16:00",
    "createdAt": "2026-05-27T06:53:25.901Z"
  },
  {
    "id": "lead-1779780016423",
    "name": "Bình",
    "email": "",
    "phone": "0123456789",
    "address": "Đang cập nhật",
    "project": "Lan Anh AVENUE",
    "subdivision": "Bình Dương",
    "budget": "2 – 5 tỷ",
    "score": 87,
    "interestLevel": "Lead nóng",
    "views": 1,
    "docs": 0,
    "behavior": "Khảo sát: Nhu cầu Mua để ở. Ghi chú: Nhận tư vấn",
    "agent": "Trần Minh Thư",
    "status": "Mới",
    "source": "Zalo",
    "appointmentDate": "Thứ Năm, 28/05/2026",
    "appointmentTime": "Sáng: 08:30 - 10:30",
    "createdAt": "2026-05-26T07:20:16.423Z"
  },
  {
    "id": "lead-1779779443326",
    "name": "Bình",
    "email": "binh@gmail.com",
    "phone": "0886868686",
    "address": "Đang cập nhật",
    "project": "dat_nen",
    "subdivision": "TP. Hồ Chí Minh",
    "budget": "Chưa cập nhật",
    "score": 73,
    "interestLevel": "Tiềm năng",
    "views": 1,
    "docs": 0,
    "behavior": "Đăng ký tư vấn",
    "agent": "Nguyễn Hoàng",
    "status": "Mới",
    "source": "Facebook Ads",
    "createdAt": "2026-05-26T07:10:43.326Z"
  }
];

function parseVnDate(dateStr, timeStr) {
  try {
    if (!dateStr) return new Date(0);
    const datePart = dateStr.split(',').pop().trim();
    const [d, m, y] = datePart.split('/').map(Number);
    
    let hour = 12;
    let min = 0;
    if (timeStr) {
      const timeMatch = timeStr.match(/(\d{2}):(\d{2})/);
      if (timeMatch) {
        hour = parseInt(timeMatch[1], 10);
        min = parseInt(timeMatch[2], 10);
      }
    }
    return new Date(y, m - 1, d, hour, min);
  } catch (e) {
    return new Date(0);
  }
}

function migrateLeads(leads) {
  let modified = false;
  leads.forEach(lead => {
    if (!lead.appointments) {
      lead.appointments = [];
      modified = true;
    }
    
    if (lead.activityLog) {
      lead.activityLog.forEach(event => {
        if (event.type === 'appointment' || (event.title && event.title.includes('Đặt lịch'))) {
          const desc = event.desc || '';
          let match = desc.match(/Đặt lịch khảo sát dự án (.*?) - (.*?) \((.*?)\)/);
          let project = '';
          let date = '';
          let time = '';
          
          if (match) {
            project = match[1].trim();
            date = match[2].trim();
            time = match[3].trim();
          } else if (lead.appointmentDate && lead.appointmentTime) {
            project = lead.project || 'Chưa chọn';
            date = lead.appointmentDate;
            time = lead.appointmentTime;
          }
          
          if (project && date && time) {
            const exists = lead.appointments.some(
              a => a.appointmentDate === date && a.appointmentTime === time && a.project === project
            );
            if (!exists) {
              let createdAt = new Date().toISOString();
              if (event.time) {
                const parts = event.time.split(' ');
                if (parts.length === 2) {
                  const [timePart, datePart] = parts;
                  const [hour, min] = timePart.split(':');
                  const [d, m, y] = datePart.split('/');
                  if (y && m && d && hour && min) {
                    createdAt = new Date(y, m - 1, d, hour, min).toISOString();
                  }
                }
              }
              
              lead.appointments.push({
                id: `app-migrated-${Math.random().toString(36).substr(2, 9)}`,
                project: project,
                appointmentDate: date,
                appointmentTime: time,
                agent: lead.agent || 'Nguyễn Hoàng',
                status: lead.status || 'Mới',
                createdAt: createdAt
              });
              modified = true;
            }
          }
        }
      });
    }
    
    if (lead.appointmentDate && lead.appointmentTime && lead.appointments.length === 0) {
      lead.appointments.push({
        id: `app-migrated-${Math.random().toString(36).substr(2, 9)}`,
        project: lead.project || 'Chưa chọn',
        appointmentDate: lead.appointmentDate,
        appointmentTime: lead.appointmentTime,
        agent: lead.agent || 'Nguyễn Hoàng',
        status: lead.status || 'Mới',
        createdAt: lead.createdAt || new Date().toISOString()
      });
      modified = true;
    }
    
    // Auto-update status for past appointments
    if (lead.appointments) {
      lead.appointments.forEach(app => {
        const appDate = parseVnDate(app.appointmentDate, app.appointmentTime);
        if (appDate < new Date()) {
          if (!app.status || app.status === 'Mới' || app.status === 'Đang tư vấn') {
            const sum = (app.project || '').charCodeAt(0) + (app.appointmentDate || '').charCodeAt(0);
            app.status = (sum % 3 === 0) ? 'Đã cọc' : 'Đã tư vấn';
            modified = true;
          }
        }
      });
    }
    
    // Sort descending
    lead.appointments.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    
    // Sync latest appointment status back to top-level status
    if (lead.appointments.length > 0) {
      const latestApp = lead.appointments[0];
      if (lead.status !== latestApp.status) {
        lead.status = latestApp.status;
        modified = true;
      }
      if (lead.agent !== latestApp.agent) {
        lead.agent = latestApp.agent;
        modified = true;
      }
      if (lead.appointmentDate !== latestApp.appointmentDate) {
        lead.appointmentDate = latestApp.appointmentDate;
        modified = true;
      }
      if (lead.appointmentTime !== latestApp.appointmentTime) {
        lead.appointmentTime = latestApp.appointmentTime;
        modified = true;
      }
    }
  });
  
  return modified;
}

function readLeads() {
  try {
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(initialLeads, null, 2), 'utf-8');
      return initialLeads;
    }
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    const leads = JSON.parse(data);
    
    if (migrateLeads(leads)) {
      writeLeads(leads);
    }
    
    return leads;
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

  if (pathname === '/api/leads/interaction') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const { phone, project, click, durationSeconds } = JSON.parse(body);
          if (!phone || !project) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing phone or project' }));
            return;
          }
          const leads = readLeads();
          const norm = phone.replace(/\D/g, '');
          const existing = leads.find(l => (l.phone || '').replace(/\D/g, '') === norm);
          if (existing) {
            if (!existing.projectInteractions) {
              existing.projectInteractions = {};
            }
            if (!existing.projectInteractions[project]) {
              existing.projectInteractions[project] = { clicks: 0, durationSeconds: 0 };
            }
            if (click) {
              existing.projectInteractions[project].clicks += 1;
            }
            if (durationSeconds) {
              existing.projectInteractions[project].durationSeconds += durationSeconds;
            }

            // Update lead score based on clicks and stay duration
            const clicks = existing.projectInteractions[project].clicks || 0;
            const duration = existing.projectInteractions[project].durationSeconds || 0;
            const interactionScore = Math.min(100, 50 + clicks * 3 + Math.floor(duration / 5));
            existing.score = Math.max(existing.score || 50, interactionScore);
            if (existing.score >= 80) {
              existing.interestLevel = 'Lead nóng';
            } else if (existing.score >= 60) {
              existing.interestLevel = 'Tiềm năng';
            } else {
              existing.interestLevel = 'Tham khảo';
            }

            // Also log to activityLog to make it fully detailed
            if (!existing.activityLog) {
              existing.activityLog = [];
            }
            const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN');
             if (click) {
              existing.activityLog.unshift({
                type: 'web',
                title: `Xem chi tiết: ${project}`,
                time: timeStr,
                desc: `Nhấp chuột xem dự án.`,
                sessionDuration: 0
              });
            } else if (durationSeconds) {
              const matchedLog = existing.activityLog.find(log => log.title === `Xem chi tiết: ${project}`);
              if (matchedLog) {
                if (matchedLog.sessionDuration === undefined) {
                  matchedLog.sessionDuration = 0;
                }
                matchedLog.sessionDuration += durationSeconds;
                matchedLog.desc = `Nhấp chuột xem dự án. Tổng thời gian xem: ${matchedLog.sessionDuration} giây.`;
              } else {
                existing.activityLog.unshift({
                  type: 'web',
                  title: `Xem chi tiết: ${project}`,
                  time: timeStr,
                  desc: `Nhấp chuột xem dự án. Tổng thời gian xem: ${durationSeconds} giây.`,
                  sessionDuration: durationSeconds
                });
              }
            }

            writeLeads(leads);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(existing));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Lead not found' }));
          }
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }
  }

  if (pathname.startsWith('/api/leads/appointments/')) {
    const leads = readLeads();
    const appId = pathname.split('/').pop();
    
    let foundLead = null;
    let foundApp = null;
    let foundAppIndex = -1;
    
    for (const lead of leads) {
      if (lead.appointments) {
        const idx = lead.appointments.findIndex(a => a.id === appId);
        if (idx !== -1) {
          foundLead = lead;
          foundApp = lead.appointments[idx];
          foundAppIndex = idx;
          break;
        }
      }
    }
    
    if (req.method === 'PUT') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const updateData = JSON.parse(body);
          if (foundApp && foundLead) {
            if (updateData.status !== undefined) foundApp.status = updateData.status;
            if (updateData.agent !== undefined) foundApp.agent = updateData.agent;
            
            // Sync to top-level if it's the latest appointment
            if (foundLead.appointments[0] && foundLead.appointments[0].id === appId) {
              if (updateData.status !== undefined) foundLead.status = updateData.status;
              if (updateData.agent !== undefined) foundLead.agent = updateData.agent;
            }
          } else {
            // Fallback: search leadId matching appId
            const lead = leads.find(l => l.id === appId);
            if (lead) {
              if (updateData.status !== undefined) lead.status = updateData.status;
              if (updateData.agent !== undefined) lead.agent = updateData.agent;
            }
          }
          writeLeads(leads);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    } else if (req.method === 'DELETE') {
      if (foundLead && foundAppIndex !== -1) {
        foundLead.appointments.splice(foundAppIndex, 1);
        if (foundLead.appointments.length === 0) {
          foundLead.appointmentDate = '';
          foundLead.appointmentTime = '';
        } else {
          const latest = foundLead.appointments[0];
          foundLead.appointmentDate = latest.appointmentDate;
          foundLead.appointmentTime = latest.appointmentTime;
        }
      } else {
        // Fallback: clear top level of the lead if appId matches lead.id
        const lead = leads.find(l => l.id === appId);
        if (lead) {
          lead.appointmentDate = '';
          lead.appointmentTime = '';
        }
      }
      writeLeads(leads);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true }));
      return;
    }
  }

  if (pathname === '/api/leads') {
    const leads = readLeads();

    if (req.method === 'GET') {
      const phoneParam = parsedUrl.searchParams.get('phone');
      if (phoneParam) {
        const norm = phoneParam.replace(/\D/g, '');
        const matched = leads.find(l => (l.phone || '').replace(/\D/g, '') === norm);
        if (matched) {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(matched));
          return;
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Lead not found' }));
          return;
        }
      }
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
          
          const normalizePhone = (p) => p ? p.replace(/\D/g, '') : '';
          const normalizedInputPhone = normalizePhone(clientData.phone);
          
          const resolveRegion = (projName) => {
            if (!projName) return 'TP. Hồ Chí Minh';
            const nameLower = projName.toLowerCase();
            if (nameLower.includes('vinhomes') || nameLower.includes('hồ chí minh') || nameLower.includes('thủ đức') || nameLower.includes('hóc môn') || nameLower.includes('saigon park')) {
              return 'TP. Hồ Chí Minh';
            }
            if (nameLower.includes('felix') || nameLower.includes('infinity') || nameLower.includes('lan anh') || nameLower.includes('gia khải') || nameLower.includes('khánh bình') || nameLower.includes('bình dương') || nameLower.includes('bến cát') || nameLower.includes('dĩ an')) {
              return 'Bình Dương';
            }
            if (nameLower.includes('seahorse') || nameLower.includes('bình phước')) {
              return 'Bình Phước';
            }
            if (nameLower.includes('gold coast') || nameLower.includes('vũng tàu')) {
              return 'Vũng Tàu';
            }
            return 'TP. Hồ Chí Minh';
          };

          const existingLeadIndex = leads.findIndex(l => normalizePhone(l.phone) === normalizedInputPhone);

          if (existingLeadIndex !== -1) {
            // Merge logic
            const existing = leads[existingLeadIndex];
            if (clientData.name && clientData.name !== 'Khách hàng ẩn danh') {
              existing.name = clientData.name;
            }
            if (clientData.email) {
              existing.email = clientData.email;
            }
            if (clientData.address && clientData.address !== 'Đang cập nhật') {
              existing.address = clientData.address;
            }
            if (clientData.project) {
              existing.project = clientData.project;
              existing.subdivision = clientData.subdivision || resolveRegion(clientData.project);
            }
            if (clientData.budget && clientData.budget !== 'Chưa cập nhật') {
              existing.budget = clientData.budget;
            }
            if (clientData.agent) {
              existing.agent = clientData.agent;
            }
            if (clientData.status) {
              existing.status = clientData.status;
            }
            if (clientData.appointmentDate) {
              existing.appointmentDate = clientData.appointmentDate;
            }
            if (clientData.appointmentTime) {
              existing.appointmentTime = clientData.appointmentTime;
            }
            if (clientData.appointmentDate && clientData.appointmentTime) {
              if (!existing.appointments) {
                existing.appointments = [];
              }
              const exists = existing.appointments.some(
                a => a.appointmentDate === clientData.appointmentDate && a.appointmentTime === clientData.appointmentTime && a.project === (clientData.project || existing.project)
              );
              if (!exists) {
                existing.appointments.unshift({
                  id: `app-${Date.now()}`,
                  project: clientData.project || existing.project || 'Chưa chọn',
                  appointmentDate: clientData.appointmentDate,
                  appointmentTime: clientData.appointmentTime,
                  agent: clientData.agent || existing.agent || 'Nguyễn Hoàng',
                  status: 'Mới',
                  createdAt: new Date().toISOString()
                });
              }
            }
            
            existing.views = (existing.views || 0) + 1;

            if (!existing.activityLog) {
              existing.activityLog = [];
            }

            let eventTitle = 'Hoạt động website';
            let eventDesc = clientData.behavior || 'Truy cập trang';
            let eventType = 'web';

            if (clientData.appointmentDate && clientData.appointmentTime) {
              eventTitle = 'Đặt lịch khảo sát';
              eventDesc = `Đặt lịch khảo sát dự án ${clientData.project || existing.project} - ${clientData.appointmentDate} (${clientData.appointmentTime})`;
              eventType = 'appointment';
            } else if (clientData.behavior && clientData.behavior.includes('Khảo sát')) {
              eventTitle = 'Khảo sát nhu cầu';
              eventDesc = clientData.behavior;
              eventType = 'web';
            } else if (clientData.behavior && clientData.behavior.includes('Đăng ký tư vấn')) {
              eventTitle = 'Đăng ký tư vấn';
              eventDesc = clientData.behavior;
              eventType = 'web';
            } else if (clientData.behavior && clientData.behavior.includes('Cập nhật thông tin')) {
              eventTitle = 'Cập nhật thông tin cá nhân';
              eventDesc = clientData.behavior;
              eventType = 'web';
            }

            const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN');
            existing.activityLog.unshift({
              type: eventType,
              title: eventTitle,
              time: timeStr,
              desc: eventDesc
            });

            existing.behavior = eventDesc;
            
            writeLeads(leads);

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(existing));
          } else {
            // Create new lead
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
              subdivision: clientData.subdivision || resolveRegion(clientData.project),
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
              createdAt: new Date().toISOString(),
              appointments: []
            };

            if (clientData.appointmentDate && clientData.appointmentTime) {
              newLead.appointments.push({
                id: `app-${Date.now()}`,
                project: clientData.project || newLead.project,
                appointmentDate: clientData.appointmentDate,
                appointmentTime: clientData.appointmentTime,
                agent: newLead.agent,
                status: 'Mới',
                createdAt: new Date().toISOString()
              });
            }

            const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN');
            const defaultEvent = {
              type: clientData.appointmentDate ? 'appointment' : 'web',
              title: clientData.appointmentDate ? 'Đặt lịch khảo sát' : 'Truy cập website',
              time: timeStr,
              desc: clientData.appointmentDate ? 
                `Đặt lịch khảo sát dự án ${clientData.project || 'Vinhomes Saigon Park'} - ${clientData.appointmentDate} (${clientData.appointmentTime})` : 
                (clientData.behavior || 'Truy cập trang')
            };
            newLead.activityLog = [defaultEvent];

            leads.unshift(newLead);
            writeLeads(leads);

            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(newLead));
          }
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
