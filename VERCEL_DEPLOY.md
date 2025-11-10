# Hướng dẫn Triển khai trên Vercel

## Bước 1: Chuẩn bị Repository

1. Tạo repository trên GitHub
2. Push code lên repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

## Bước 2: Triển khai trên Vercel

### Cách 1: Triển khai qua Vercel Dashboard

1. Truy cập [Vercel](https://vercel.com) và đăng nhập
2. Click "New Project"
3. Chọn repository từ GitHub
4. Vercel sẽ tự động detect Next.js
5. Click "Deploy"

### Cách 2: Sử dụng Vercel CLI

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Đăng nhập
vercel login

# Triển khai
vercel

# Triển khai production
vercel --prod
```

## Bước 3: Cấu hình Database (Quan trọng!)

Ứng dụng hiện tại sử dụng file system để lưu trữ, nhưng Vercel sử dụng serverless functions với file system read-only. Bạn cần sử dụng database service:

### Option 1: Vercel KV (Redis) - Miễn phí

1. Vào Vercel Dashboard > Storage > Create Database > KV
2. Copy connection string
3. Thêm environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
4. Cập nhật `lib/database.ts` để sử dụng Vercel KV

### Option 2: Vercel Postgres

1. Vào Vercel Dashboard > Storage > Create Database > Postgres
2. Copy connection string
3. Thêm environment variable: `POSTGRES_URL`
4. Cập nhật `lib/database.ts` để sử dụng Postgres

### Option 3: Supabase (Miễn phí)

1. Tạo tài khoản tại [Supabase](https://supabase.com)
2. Tạo project mới
3. Copy connection string
4. Thêm environment variable: `DATABASE_URL`
5. Cập nhật `lib/database.ts` để sử dụng Supabase

### Option 4: MongoDB Atlas (Miễn phí)

1. Tạo tài khoản tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo cluster miễn phí
3. Copy connection string
4. Thêm environment variable: `MONGODB_URI`
5. Cập nhật `lib/database.ts` để sử dụng MongoDB

## Bước 4: Cấu hình File Uploads

File uploads cần được lưu trên cloud storage:

### Option 1: Vercel Blob Storage

1. Vào Vercel Dashboard > Storage > Create Database > Blob
2. Copy token
3. Thêm environment variable: `BLOB_READ_WRITE_TOKEN`
4. Cập nhật `app/api/exercises/upload/route.ts`

### Option 2: Cloudinary (Miễn phí)

1. Tạo tài khoản tại [Cloudinary](https://cloudinary.com)
2. Copy API keys
3. Thêm environment variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Cập nhật `app/api/exercises/upload/route.ts`

### Option 3: AWS S3

1. Tạo AWS account
2. Tạo S3 bucket
3. Copy credentials
4. Thêm environment variables:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_S3_BUCKET_NAME`
5. Cập nhật `app/api/exercises/upload/route.ts`

## Bước 5: Thêm Environment Variables

Vào Vercel Dashboard > Project Settings > Environment Variables và thêm:

- Database connection strings (tùy chọn database service)
- File upload credentials (tùy chọn storage service)
- API keys (nếu có)

## Bước 6: Kiểm tra Triển khai

1. Truy cập URL được cung cấp bởi Vercel
2. Test các tính năng:
   - Upload bài tập
   - Làm bài tập
   - Chấm điểm
   - Xóa bài tập

## Lưu Ý

- Vercel có giới hạn function timeout (10 giây cho free plan, 60 giây cho paid plan)
- OCR processing có thể mất thời gian, cân nhắc sử dụng background jobs
- File system không thể write trên Vercel, bắt buộc phải dùng database và cloud storage
- Đảm bảo thêm các environment variables cần thiết trước khi deploy

## Troubleshooting

### Lỗi: Cannot write to file system
**Giải pháp**: Sử dụng database service và cloud storage như hướng dẫn trên

### Lỗi: Function timeout
**Giải pháp**: 
- Tăng timeout trong `vercel.json`
- Hoặc upgrade lên Vercel Pro plan
- Hoặc tối ưu hóa OCR processing

### Lỗi: Module not found
**Giải pháp**: Đảm bảo tất cả dependencies đã được cài đặt và có trong `package.json`

### Lỗi: Environment variables not found
**Giải pháp**: Thêm environment variables trong Vercel Dashboard và redeploy

