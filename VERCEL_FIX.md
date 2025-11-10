# Fix Lỗi "No Next.js version detected" trên Vercel 🔧

## Nguyên Nhân

Lỗi này xảy ra khi Vercel không tìm thấy Next.js trong package.json. Có thể do:
1. Root Directory setting không đúng
2. package.json không được commit lên GitHub
3. Build settings không đúng

## Giải Pháp

### Bước 1: Kiểm Tra package.json

Đảm bảo `package.json` có Next.js:

```json
{
  "dependencies": {
    "next": "^14.0.0",
    ...
  }
}
```

### Bước 2: Kiểm Tra Root Directory trên Vercel

1. Vào Vercel Dashboard
2. Chọn project của bạn
3. Vào **Settings** > **General**
4. Kiểm tra **Root Directory**
5. Đảm bảo nó là **`.`** (root) hoặc để trống

### Bước 3: Cập Nhật vercel.json

Đảm bảo `vercel.json` có cấu hình đúng:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Bước 4: Kiểm Tra Git

Đảm bảo package.json được commit:

```bash
git status
git add package.json
git commit -m "Ensure package.json is committed"
git push
```

### Bước 5: Redeploy

1. Vào Vercel Dashboard
2. Chọn project
3. Vào **Deployments**
4. Click **Redeploy** trên deployment mới nhất

## Giải Pháp Nhanh

### Option 1: Xóa và Tạo Lại Project

1. Xóa project trên Vercel
2. Tạo project mới
3. Chọn repository GitHub
4. Vercel sẽ tự động detect Next.js

### Option 2: Sử dụng Vercel CLI

```bash
# Xóa .vercel nếu có
rm -rf .vercel

# Deploy lại
vercel

# Hoặc deploy production
vercel --prod
```

### Option 3: Kiểm Tra File Structure

Đảm bảo cấu trúc thư mục như sau:

```
your-repo/
├── package.json       ← Phải ở root
├── next.config.js
├── tsconfig.json
├── app/
├── components/
└── ...
```

## Troubleshooting

### Lỗi vẫn còn?

1. **Kiểm tra logs trên Vercel Dashboard**
   - Vào **Deployments** > Chọn deployment > Xem **Build Logs**

2. **Kiểm tra package.json có trong GitHub**
   - Vào GitHub repository
   - Đảm bảo `package.json` có trong root directory

3. **Kiểm tra Node.js version**
   - Thêm vào `package.json`:
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

4. **Xóa cache và rebuild**
   - Trên Vercel Dashboard: **Settings** > **General** > **Clear Build Cache**
   - Redeploy project

## Kiểm Tra Nhanh

Chạy lệnh này để kiểm tra:

```bash
# Kiểm tra Next.js có trong package.json
cat package.json | grep next

# Kiểm tra package.json có được commit
git ls-files | grep package.json

# Build local để test
npm run build
```

## Kết Luận

Sau khi thực hiện các bước trên, lỗi sẽ được fix. Nếu vẫn còn vấn đề, kiểm tra:
- Build logs trên Vercel
- GitHub repository có đầy đủ files không
- Root Directory setting trên Vercel

