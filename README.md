# Giới thiệu Website: Trao Đồ Cũ

Đây là một website sử dụng ReactJS được xây dựng với Create React App. Website cung cấp giải pháp trao tặng, trao đổi đồ cũ với những người có nhu cầu.

## Tính năng

- [Tính năng 1, ví dụ: "Tạo, cập nhật và xóa các liên kết rút gọn"]
- [Tính năng 2, ví dụ: "Tìm kiếm và lọc dữ liệu qua giao diện trực quan"]
- [Tính năng 3, ví dụ: "Xác thực người dùng và kiểm soát truy cập dựa trên vai trò"]

## Yêu cầu

Trước khi bắt đầu, đảm bảo rằng bạn đã cài đặt các công cụ sau:

- [Node.js](https://nodejs.org/) (khuyến nghị phiên bản v14 trở lên)
- npm (đi kèm với Node.js) hoặc yarn
- Trình duyệt web (ví dụ: Chrome, Firefox)

## Cài đặt

Thực hiện các bước sau để cài đặt và chạy dự án trên máy tính:

1. Clone repository:

   ```bash
   git clone https://github.com/AxtraLab/Exchange_WEB_Front_End.git
   ```

2. Di chuyển vào thư mục dự án:

   ```bash
   cd Exchange_WEB_Front_End
   ```

3. Cài đặt các thư viện:
   ```bash
   npm install
   # Hoặc sử dụng yarn
   yarn install
   ```

## Chạy ứng dụng

Khởi chạy server phát triển:

```bash
npm start
# Hoặc sử dụng yarn
yarn start
```

Ứng dụng sẽ được mở trong trình duyệt mặc định tại `http://localhost:3000`.

## Build cho môi trường Production

Để tạo build cho môi trường production:

```bash
npm run build
# Hoặc sử dụng yarn
yarn build
```

Các file sẵn sàng cho production sẽ nằm trong thư mục `build`. Triển khai các file này lên dịch vụ hosting của bạn.

## Cấu trúc thư mục

Cấu trúc thư mục dự án của bạn:

```
.
├── public        // Các file tĩnh
├── src
│   ├── assets   // Hình ảnh, style, v.v.
│   ├── components // Các component tái sử dụng
│   ├── config   // Cấu hình chung
│   ├── constants // Các hằng số
│   ├── features // Các tính năng
│   ├── helpers  // Các hàm trợ giúp
│   ├── hooks    // Custom hooks
│   ├── layouts  // Các layout của trang
│   ├── pages    // Các trang chính
│   ├── redux    // Quản lý trạng thái với Redux
│   ├── routes   // Định tuyến
│   ├── services // Các API call
│   ├── utils    // Các hàm tiện ích
│   └── index.js // File khởi chạy chính
├── .env
├── package.json
└── README.md
```

## Đóng góp

Chào mừng mọi đóng góp! Vui lòng fork repository này và gửi pull request với các thay đổi của bạn.

## Giấy phép

Dự án này được cấp phép theo giấy phép MIT. Xem file [LICENSE](./LICENSE) để biết thêm chi tiết.
