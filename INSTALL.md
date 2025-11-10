# Hướng Dẫn Cài Đặt 🚀

## Yêu Cầu Hệ Thống

- Node.js 18.x hoặc cao hơn
- npm hoặc yarn
- Git (tùy chọn)

## Cài Đặt

### 1. Clone Repository

```bash
git clone <repository-url>
cd minhdanghoc
```

Hoặc tải code và giải nén vào thư mục.

### 2. Cài Đặt Dependencies

```bash
npm install
```

Hoặc nếu sử dụng yarn:

```bash
yarn install
```

### 3. Chạy Ứng Dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000)

## Build cho Production

```bash
npm run build
npm start
```

## Kiểm Tra

Sau khi cài đặt, bạn có thể:

1. Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)
2. Click "Tải Bài Tập Mới"
3. Upload một file hình ảnh hoặc PDF
4. Làm bài tập và kiểm tra chức năng chấm điểm

## Troubleshooting

### Lỗi: Cannot find module

```bash
# Xóa node_modules và cài đặt lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: Port 3000 already in use

```bash
# Sử dụng port khác
PORT=3001 npm run dev
```

### Lỗi: OCR không hoạt động

- Đảm bảo đã cài đặt đầy đủ dependencies
- Kiểm tra file hình ảnh có chất lượng tốt
- Thử với file nhỏ hơn

### Lỗi: Cannot write to file system

- Đảm bảo có quyền ghi vào thư mục `data` và `public/uploads`
- Trên Windows, có thể cần chạy với quyền Administrator

## Cấu Hình Môi Trường

Tạo file `.env.local` (tùy chọn) để cấu hình:

```env
# Database (nếu sử dụng database service)
DATABASE_URL=your_database_url

# File Storage (nếu sử dụng cloud storage)
STORAGE_URL=your_storage_url
```

## Lưu Ý

- Ứng dụng sử dụng file system để lưu trữ trong development
- Để triển khai trên Vercel, cần cấu hình database và cloud storage
- Xem file `VERCEL_DEPLOY.md` để biết chi tiết

## Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra file `README.md` và `QUICK_START.md`
2. Kiểm tra console log để xem lỗi chi tiết
3. Đảm bảo đã cài đặt đầy đủ dependencies

