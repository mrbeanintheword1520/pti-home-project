# PTI Home - PropTech Frontend Platform

Dự án PTI Home Frontend là bộ khung giao diện website được phát triển bằng Angular, phục vụ định hướng phát triển nền tảng số trong lĩnh vực bất động sản (PropTech) cho dự án Vinhomes Sai Gon Park.

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
```bash
npm start
# (hoặc có thể dùng lệnh: ng serve)
```

**Bước 4:** Trải nghiệm website trên trình duyệt
Sau khi Terminal báo compile thành công, hãy mở trình duyệt (Chrome, Cốc Cốc...) và truy cập:
*   **Giao diện Khách hàng (User):** `http://localhost:4200/`
*   **Giao diện Quản trị viên (Admin):** `http://localhost:4200/admin`

*(Lưu ý: Dự án sử dụng chung một lệnh chạy `npm start`, việc tách biệt giao diện Admin và User được xử lý tự động thông qua đường dẫn URL ở trên).*

---

## 📁 GIẢI THÍCH CÂY THƯ MỤC THEO ĐỊNH HƯỚNG DỰ ÁN
Dự án được xây dựng theo tiêu chuẩn **Clean Architecture** của Angular. Dưới đây là ý nghĩa thực tế ứng dụng vào đồ án PTI Home:

### 1. Thư mục `src/app/core/` (Lõi hệ thống & Kết nối dữ liệu)
Chứa các logic cốt lõi và giao tiếp với Backend.
*   **`models/`**: Nơi định nghĩa khung dữ liệu (Ví dụ: `project.model.ts` lưu giá tiền, diện tích dự án Vinhomes; `lead.model.ts` lưu thông tin số điện thoại khách hàng).
*   **`services/`**: Nơi viết các file gọi API (Ví dụ: gọi API để AI tư vấn, hoặc gọi Zalo OA lấy tin nhắn).
*   **`guards/`**: Các "bảo vệ" giúp chặn link. Ví dụ: Chặn không cho khách thường gõ link truy cập vào trang Admin CRM.

### 2. Thư mục `src/app/shared/` (Thành phần giao diện dùng chung)
Chứa các mảnh ghép UI tái sử dụng để tiết kiệm thời gian code.
*   **`components/`**: Chứa các Nút bấm, Thẻ dự án (Property Card), Popup Form. Code một lần và mang ra dùng ở cả Trang chủ lẫn Trang dự án.
*   **`pipes/`**: Công cụ định dạng dữ liệu (Ví dụ: tự động format số `3500000000` thành `3.5 Tỷ VNĐ`).

### 3. Thư mục `src/app/layouts/` (Khung Bố Cục)
Đây là "cái khung tranh" cố định bao bọc website khi khách hàng chuyển trang:
*   **`main-layout`**: Khung dành cho User, chứa thanh điều hướng `Header` và chân trang `Footer`.
*   **`admin-layout`**: Khung dành cho Chuyên viên PTI Home, chứa thanh menu dọc `Sidebar` và thanh công cụ `Topbar` giống như một phần mềm quản lý.

### 4. Thư mục `src/app/pages/` (Các Trang Tính Năng)
Đây là "bức tranh" được gắn vào giữa cái khung layout ở trên. Tương ứng với danh sách tính năng Chương 5 & 7 của đồ án:
*   `home/`: Trang chủ.
*   `ai-advisor/`: Trang trợ lý đầu tư AI.
*   `market-analysis/`: Trung tâm phân tích biểu đồ thị trường.
*   `investment-simulator/`: Công cụ mô phỏng lợi nhuận ROI & Tính vay vốn.
*   `admin/dashboard/`: Nơi Admin xem tổng quan hệ thống CRM và Hệ thống chấm điểm Smart Lead.

### 5. Thư mục `src/styles/` (Hệ thống Thiết kế - Design System)
*   Sử dụng SCSS thay vì CSS thường để giao diện mang đậm chất cao cấp (Premium) của PropTech.
*   **`_variables.scss`**: Chứa mã màu thương hiệu (Tím chủ đạo, Xanh Teal).
*   **`_mixins.scss`**: Chứa các hiệu ứng kính mờ (Glassmorphism), bóng đổ dùng chung cho toàn dự án.

---

## 🌟 TỔNG QUAN CÁC TÍNH NĂNG (ĐỀ XUẤT)
*   **Cá nhân hóa hành trình:** Tìm kiếm & hiển thị nội dung theo mục đích (Mua ở, Đầu tư, Cho thuê).
*   **Smart Form & AI Advisor:** Thu thập thông tin tự nhiên như đang chat và tư vấn tự động.
*   **Smart Lead System:** Chấm điểm mức độ quan tâm của khách hàng để nhân viên ưu tiên chăm sóc.
*   **Interactive Map:** Bản đồ phân khu dự án tương tác trực tiếp.

---
*Đồ án được nghiên cứu và phát triển bởi: Khánh Xuân, Khánh Bình, Ánh Linh.*
