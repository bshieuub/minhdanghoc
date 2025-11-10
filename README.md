# Ứng dụng Học Tập Cho Minh Đăng 🎓

Ứng dụng web để tải bài tập, chuyển đổi thành dạng điện tử và tự động chấm điểm.

## Tính năng

- 📤 Tải bài tập lên (PDF, hình ảnh)
- 🔄 Tự động chuyển đổi thành bài tập điện tử (OCR)
- 📚 Phân loại theo môn học (Tiếng Việt, Toán, Tiếng Anh)
- ✏️ Làm bài tập trên nhiều thiết bị
- ✅ Tự động chấm điểm
- 🎉 Lời khen ngẫu nhiên tạo cảm hứng
- 🗑️ Xóa bài tập với xác nhận
- 🎨 Giao diện thân thiện với biểu tượng dễ thương cho bé trai

## Công nghệ

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Tesseract.js (OCR)
- React Hot Toast (Notifications)
- Lucide React (Icons)

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy ứng dụng ở chế độ development
npm run dev

# Build cho production
npm run build

# Chạy production build
npm start
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Triển khai trên Vercel

### Cách 1: Triển khai trực tiếp từ GitHub

1. Push code lên GitHub repository
2. Vào [Vercel](https://vercel.com) và đăng nhập
3. Click "New Project" và chọn repository của bạn
4. Vercel sẽ tự động detect Next.js và cấu hình
5. Click "Deploy"

### Cách 2: Sử dụng Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Đăng nhập vào Vercel
vercel login

# Triển khai
vercel

# Triển khai production
vercel --prod
```

### Lưu ý quan trọng cho Vercel

**✅ GIẢI PHÁP TẠM THỜI ĐÃ SẴN SÀNG!**

Ứng dụng đã được cập nhật để **tự động hoạt động trên Vercel** mà không cần cấu hình!

#### Deploy Ngay (Không Cần Cấu Hình)

1. **In-Memory Storage**: Ứng dụng tự động sử dụng in-memory storage trên Vercel
   - ✅ Cho phép deploy ngay
   - ✅ Ứng dụng sẽ chạy được
   - ⚠️ Dữ liệu sẽ mất khi server restart (hành vi bình thường của serverless)

2. **File Storage**: Files được lưu trong memory và serve qua API
   - ✅ Upload hoạt động ngay
   - ✅ Files có thể xem được
   - ⚠️ Files sẽ mất khi server restart

3. **Xem hướng dẫn chi tiết**: `DEPLOY_INSTRUCTIONS.md`

#### Cấu Hình Production (Tùy Chọn)

Nếu cần lưu trữ dữ liệu lâu dài:

1. **Database**: 
   - Sử dụng Vercel KV (đơn giản nhất) - Xem `VERCEL_QUICK_FIX.md`
   - Hoặc Vercel Postgres, Supabase, MongoDB Atlas

2. **File Storage**:
   - Sử dụng Vercel Blob Storage - Xem `VERCEL_QUICK_FIX.md`
   - Hoặc AWS S3, Cloudinary

3. **Environment Variables**: Thêm trong Vercel Dashboard nếu sử dụng database/storage service

4. **Function Timeout**: OCR processing có thể mất thời gian, đảm bảo cấu hình timeout phù hợp trong `vercel.json`

## Cấu trúc Dự án

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── exercise/          # Exercise pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── DeleteConfirmModal.tsx
│   ├── ExerciseList.tsx
│   ├── ExerciseUpload.tsx
│   └── ExerciseView.tsx
├── lib/                   # Utilities
│   ├── database.ts        # Database functions
│   └── ocr.ts             # OCR processing
├── types/                 # TypeScript types
├── utils/                 # Helper functions
│   └── praises.ts         # Praise messages
└── public/                # Static files
    └── uploads/           # Uploaded files
```

## Tính năng Chi tiết

### Upload Bài Tập
- Hỗ trợ file PDF và hình ảnh (PNG, JPG, JPEG)
- Tự động nhận diện văn bản từ hình ảnh (OCR)
- Phân loại theo môn học
- Lưu và hiển thị hình ảnh gốc trong bài tập điện tử

### Làm Bài Tập
- Giao diện thân thiện, dễ sử dụng
- Hiển thị hình ảnh bài tập gốc (có thể phóng to)
- Hỗ trợ nhiều loại câu hỏi: trắc nghiệm, điền vào chỗ trống, tự luận
- Hiển thị kết quả ngay sau khi nộp bài
- Thumbnail hình ảnh trong danh sách bài tập

### Chấm Điểm Tự Động
- Tự động chấm điểm sau khi nộp bài
- Hiển thị đáp án đúng/sai
- Tính điểm tổng và phần trăm

### Lời Khen
- Lời khen ngẫu nhiên sau khi hoàn thành bài tập
- Tạo cảm hứng học tập cho học sinh

## Phát triển Thêm

- [ ] Tích hợp AI để tạo câu hỏi tự động
- [ ] Thêm nhiều loại câu hỏi khác
- [ ] Thống kê chi tiết về kết quả học tập
- [ ] Hệ thống thành tích và huy hiệu
- [ ] Chia sẻ bài tập với bạn bè

## License

MIT

