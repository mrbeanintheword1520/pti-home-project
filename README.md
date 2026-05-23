# PTI Home - PropTech Frontend Platform

Dự án PTI Home Frontend là bộ khung giao diện website được phát triển bằng Angular Workspace (Monorepo), phục vụ định hướng phát triển nền tảng số trong lĩnh vực bất động sản (PropTech) cho dự án Vinhomes Sai Gon Park.

Dự án được tách biệt thành 2 App độc lập (`pti-user` và `pti-admin`) chạy trên 2 cổng khác nhau để đảm bảo bảo mật và hiệu năng.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY DỰ ÁN
*(Dành cho các thành viên trong nhóm tải code về máy và chạy thử)*

### 1. Yêu cầu hệ thống cần có
*   Đã cài đặt **Node.js** (Khuyên dùng bản v20.x trở lên).
*   Đã cài đặt **Angular CLI** (Mở Terminal chạy lệnh `npm install -g @angular/cli`).

### 2. Tải và chạy dự án (Các bước tuần tự)
**Bước 1:** Tải code từ GitHub về máy
```bash
git clone <đường-dẫn-github-của-nhóm>
cd pti-home-project
```

**Bước 2:** Cài đặt các thư viện cần thiết
```bash
npm install
```

**Bước 3:** Khởi chạy server ảo để xem website
Vì đây là kiến trúc Monorepo (1 dự án chứa 2 ứng dụng), bạn cần mở 2 Terminal khác nhau để chạy 2 App song song.

**Mở Terminal 1 (Chạy App cho Khách hàng):**
```bash
npm run start:user
```
👉 Truy cập trình duyệt: `http://localhost:4200/`

**Mở Terminal 2 (Chạy App cho Admin):**
```bash
npm run start:admin
```
👉 Truy cập trình duyệt: `http://localhost:4201/`

---

## 📁 GIẢI THÍCH CÂY THƯ MỤC THEO ĐỊNH HƯỚNG DỰ ÁN
Dự án được xây dựng theo tiêu chuẩn **Clean Architecture** và **Monorepo Workspace** của Angular. Dưới đây là ý nghĩa thực tế ứng dụng vào đồ án PTI Home:

### 1. Thư mục `shared-core/` (Dùng chung cho cả 2 App)
Chứa các dữ liệu dùng chung để khi Admin thay đổi, User cũng thấy và ngược lại.
*   **`models/`**: (Ví dụ: `project.model.ts` lưu giá tiền, diện tích; `lead.model.ts` lưu thông tin khách hàng). Cả App Admin và App User đều truy cập vào đây để dùng chung kiểu dữ liệu.
*   **`styles/`**: Chứa CSS/SCSS dùng chung (Màu thương hiệu, Hiệu ứng Glassmorphism).

### 2. Thư mục `projects/pti-user/` (App dành cho Khách hàng - Cổng 4200)
Chứa toàn bộ mã nguồn của trang web dành cho khách hàng.
*   `src/app/layouts/main-layout`: Giao diện Header & Footer.
*   `src/app/pages/home`: Trang chủ.
*   `src/app/pages/ai-advisor`: Trang trợ lý đầu tư AI.
*   `src/app/pages/investment-simulator`: Công cụ mô phỏng lợi nhuận ROI.

### 3. Thư mục `projects/pti-admin/` (App dành cho Quản trị viên - Cổng 4201)
Chứa toàn bộ mã nguồn của phần mềm quản trị dành cho nhân viên PTI Home.
*   `src/app/layouts/admin-layout`: Giao diện Sidebar & Topbar (Khung phần mềm).
*   `src/app/pages/dashboard`: Biểu đồ tổng quan.
*   `src/app/pages/crm`: Hệ thống quản lý tin nhắn Zalo OA.
*   `src/app/pages/smart-leads`: Hệ thống chấm điểm khách hàng tiềm năng.

---

## 🌟 TỔNG QUAN CÁC TÍNH NĂNG (ĐỀ XUẤT)
*   **Cá nhân hóa hành trình:** Tìm kiếm & hiển thị nội dung theo mục đích (Mua ở, Đầu tư, Cho thuê).
*   **Smart Form & AI Advisor:** Thu thập thông tin tự nhiên như đang chat và tư vấn tự động.
*   **Smart Lead System:** Chấm điểm mức độ quan tâm của khách hàng để nhân viên ưu tiên chăm sóc.
*   **Interactive Map:** Bản đồ phân khu dự án tương tác trực tiếp.

---
*Đồ án được nghiên cứu và phát triển bởi: Khánh Xuân, Khánh Bình, Ánh Linh.*
