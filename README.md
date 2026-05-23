# PTI Home - PropTech Frontend Platform

Dự án PTI Home Frontend là bộ khung giao diện website được phát triển bằng kiến trúc **Angular Workspace (Monorepo)**, phục vụ định hướng phát triển nền tảng số trong lĩnh vực bất động sản (PropTech) cho dự án Vinhomes Sai Gon Park.

Kiến trúc này chia dự án thành 2 App hoàn toàn độc lập (`pti-user` và `pti-admin`) chạy song song trên 2 cổng khác nhau, giúp tăng cường tính bảo mật và dễ dàng bảo trì.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY DỰ ÁN
*(Dành cho các thành viên trong nhóm tải code về máy và chạy thử)*

### 1. Yêu cầu hệ thống cần có
*   Đã cài đặt **Node.js** (Khuyên dùng bản v20.x trở lên).
*   Đã cài đặt **Angular CLI** (Mở Terminal chạy lệnh `npm install -g @angular/cli`).

### 2. Tải và chạy dự án
**Bước 1:** Tải code từ GitHub về máy
```bash
git clone <đường-dẫn-github-của-nhóm>
cd pti-home-project
```

**Bước 2:** Cài đặt các thư viện cần thiết
```bash
npm install
```

**Bước 3:** Khởi chạy server (Mở 2 Terminal)
Vì đây là Monorepo, bạn cần mở 2 cửa sổ Terminal khác nhau để chạy 2 App song song. Hãy đảm bảo bạn luôn gõ lệnh ở thư mục gốc (`pti-home-project>`).

*   **Terminal 1 (Chạy App Khách hàng):**
    ```bash (chạy ở thư mục gốc pti-home-project luôn nha fen hyhy)
    npm run start:user
    ```
    👉 Truy cập giao diện Khách hàng: `http://localhost:4200/`

*   **Terminal 2 (Chạy App Quản trị):**
    ```bash(chạy ở thư mục gốc pti-home-project luôn nha fen hyhy)
    npm run start:admin
    ```
    👉 Truy cập giao diện Chuyên viên: `http://localhost:4201/`

---

## 📁 GIẢI THÍCH CHI TIẾT CÂY THƯ MỤC
Cây thư mục được thiết kế theo tiêu chuẩn **Clean Architecture** dành cho doanh nghiệp.

### 1. Thư mục dùng chung: `shared-core/`
Chứa các dữ liệu cốt lõi dùng chung cho cả 2 ứng dụng. Lợi ích: Khi cập nhật một trường dữ liệu (ví dụ thêm thuộc tính `email` cho khách hàng), cả Admin và User đều tự động nhận được bản cập nhật này.
*   **`models/`**: Nơi định nghĩa khung dữ liệu (Ví dụ: `project.model.ts` lưu thông tin dự án Vinhomes; `lead.model.ts` lưu điểm số tiềm năng của khách hàng).
*   **`styles/`**: Chứa CSS/SCSS dùng chung (Ví dụ: Các mã màu Tím/Xanh chuẩn thương hiệu, hoặc hiệu ứng thẻ kính mờ Glassmorphism).

### 2. Ứng dụng Khách hàng: `projects/pti-user/`
Chạy ở cổng **4200**. Đây là website công khai mà khách mua nhà sẽ truy cập.
*   `src/app/layouts/main-layout`: Giao diện Khung ngoài bao gồm `Header` (Thanh menu trên cùng) và `Footer` (Chân trang chứa thông tin liên hệ).
*   `src/app/pages/home`: Trang chủ dự án.
*   `src/app/pages/ai-advisor`: Trang công cụ AI tự động tư vấn đầu tư cho khách.
*   `src/app/pages/investment-simulator`: Công cụ cho phép khách hàng tự tính toán dòng tiền vay mua nhà.

### 3. Ứng dụng Quản trị: `projects/pti-admin/`
Chạy ở cổng **4201**. Đây là phần mềm điều hành nội bộ dành cho nhân viên PTI Home (Yêu cầu phải đăng nhập).
*   `src/app/layouts/admin-layout`: Giao diện Khung phần mềm, bao gồm `Sidebar` (Thanh điều hướng nằm dọc bên trái) và `Topbar` (Thanh công cụ nằm ngang bên trên).
*   `src/app/pages/dashboard`: Biểu đồ tổng quan hiển thị doanh số, lượt truy cập.
*   `src/app/pages/crm`: Trình quản lý tin nhắn Zalo OA, chăm sóc khách hàng.
*   `src/app/pages/smart-leads`: Hệ thống (Smart Lead System) chấm điểm khách hàng tiềm năng để nhân viên biết nên ưu tiên gọi cho ai.

---

*Đồ án được nghiên cứu và phát triển bởi:Ánh Linh, Khánh Xuân, Khánh Bình.* 
*TẠM BIỆT FEN* 