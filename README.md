# PTI Home - PropTech Frontend Platform

Dự án PTI Home Frontend là bộ khung giao diện website được phát triển bằng Angular, phục vụ định hướng phát triển nền tảng số trong lĩnh vực bất động sản (PropTech) cho dự án Vinhomes Sai Gon Park.

## 🚀 Tính năng nổi bật (Định hướng)

*   **Giao diện Người dùng (User):**
    *   Cá nhân hóa hành trình người dùng.
    *   Trợ lý tư vấn đầu tư bất động sản bằng AI.
    *   Trung tâm phân tích và theo dõi thị trường.
    *   Công cụ mô phỏng lợi nhuận đầu tư & Tính khoản vay.
    *   Bản đồ dự án tương tác.
*   **Hệ thống Quản trị (Admin):**
    *   Hệ thống chấm điểm khách hàng tiềm năng (Smart Lead System).
    *   Quản lý khách hàng CRM và tích hợp Zalo OA.

## 📁 Cấu trúc Thư mục

Dự án tuân theo kiến trúc sạch (Clean Architecture) của Angular:

*   `src/app/core/`: Chứa services (gọi API), guards (bảo vệ route), interceptors, models.
*   `src/app/shared/`: Chứa components dùng chung (buttons, cards), pipes, directives.
*   `src/app/layouts/`: 
    *   `main-layout`: Giao diện khách hàng (Header, Footer).
    *   `admin-layout`: Giao diện quản trị (Sidebar, Topbar).
*   `src/app/pages/`: Các trang cụ thể (`home`, `admin/dashboard`, `ai-advisor`,...).
*   `src/styles/`: SCSS Design System (biến màu sắc, typography, mixins).

## 🛠 Hướng dẫn Cài đặt & Chạy Dự án

### Yêu cầu hệ thống

*   Node.js (Khuyên dùng v20.x trở lên)
*   NPM hoặc Yarn
*   Angular CLI (v18.x trở lên)

### Các bước cài đặt

1.  **Clone repository về máy:**
    ```bash
    git clone <repository-url>
    cd pti-home-project
    ```

2.  **Cài đặt các gói phụ thuộc (dependencies):**
    ```bash
    npm install
    ```

3.  **Khởi chạy dự án ở môi trường phát triển (Development):**
    ```bash
    npm start
    # hoặc
    ng serve
    ```

4.  **Truy cập ứng dụng:**
    Mở trình duyệt và truy cập vào địa chỉ: `http://localhost:4200/`
    * Trang khách hàng: `http://localhost:4200/`
    * Trang quản trị: `http://localhost:4200/admin`

### Build dự án (Production)

Để build dự án chạy thực tế:

```bash
npm run build
# hoặc
ng build
```
Kết quả build sẽ được lưu trong thư mục `dist/pti-home-frontend/`.

## 🎨 Design System

Dự án sử dụng SCSS với các file cấu hình tại `src/styles/`:
*   `_variables.scss`: Chứa mã màu, font chữ, spacing, hiệu ứng.
*   `_mixins.scss`: Các hàm SCSS hỗ trợ responsive, thiết kế Glassmorphism.

Màu chủ đạo:
*   Tím (Primary): `#6C3FE8`
*   Xanh Teal (Accent): `#00D4AA`

---
*Phát triển bởi nhóm nghiên cứu: Khánh Xuân, Khánh Bình, Ánh Linh.*
