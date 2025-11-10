# Giải Pháp Nhanh Cho Vercel Deployment 🚀

## Vấn Đề

Khi deploy lên Vercel, bạn gặp lỗi vì:
1. **File system là read-only** - Không thể ghi file vào disk
2. **Database dùng file system** - Không thể lưu dữ liệu
3. **File uploads cần storage** - Không thể lưu file upload

## Giải Pháp Tạm Thời (Đã Tự Động)

Tôi đã tạo **giải pháp tạm thời tự động** cho phép deploy ngay:

### ✅ Đã Cập Nhật

1. **Database In-Memory** (`lib/database-memory.ts`)
   - Tự động phát hiện Vercel environment
   - Sử dụng in-memory storage trên Vercel
   - Vẫn dùng file system ở local development

2. **File Storage In-Memory** (`lib/storage-memory.ts`)
   - Lưu file dưới dạng Base64 trong memory
   - Tạo API endpoint để serve files
   - Tự động fallback về file system ở local

3. **File Serving API** (`app/api/files/[id]/route.ts`)
   - Serve files từ in-memory storage
   - Hỗ trợ cả file system và in-memory

### ⚠️ Lưu Ý Quan Trọng

**Giải pháp tạm thời này:**
- ✅ Cho phép deploy ngay lên Vercel
- ✅ Ứng dụng sẽ chạy được
- ❌ **Dữ liệu sẽ mất khi server restart** (Vercel serverless functions)
- ❌ **Không phù hợp cho production**

## Deploy Ngay (Không Cần Cấu Hình)

### Bước 1: Deploy lên Vercel

```bash
# Push code lên GitHub
git add .
git commit -m "Add in-memory storage for Vercel"
git push

# Deploy lên Vercel
vercel
```

### Bước 2: Kiểm Tra

1. Truy cập URL Vercel của bạn
2. Thử upload một bài tập
3. Ứng dụng sẽ hoạt động!

### Bước 3: Hiểu Rõ Giới Hạn

- Dữ liệu chỉ tồn tại trong memory của serverless function
- Khi function restart (thường xuyên trên Vercel), dữ liệu sẽ mất
- Mỗi serverless function instance có memory riêng

## Giải Pháp Production (Cần Cấu Hình)

Sau khi deploy thành công, bạn nên cấu hình database và storage thật:

### Option 1: Vercel KV (Đơn Giản Nhất) - **KHUYẾN NGHỊ**

#### Bước 1: Tạo Vercel KV

1. Vào Vercel Dashboard
2. Chọn project của bạn
3. Vào **Storage** > **Create Database** > **KV**
4. Copy connection details

#### Bước 2: Cài Đặt Dependencies

```bash
npm install @vercel/kv
```

#### Bước 3: Cập Nhật Database

Tạo file `lib/database-kv.ts`:

```typescript
import { kv } from '@vercel/kv'
import { Exercise } from '@/types'

const EXERCISES_KEY = 'exercises'

export async function getExercises(): Promise<Exercise[]> {
  try {
    const data = await kv.get<Exercise[]>(EXERCISES_KEY)
    return data || []
  } catch (error) {
    console.error('Error reading from KV:', error)
    return []
  }
}

export async function saveExercises(exercises: Exercise[]): Promise<void> {
  try {
    await kv.set(EXERCISES_KEY, exercises)
  } catch (error) {
    console.error('Error saving to KV:', error)
    throw error
  }
}

export async function getExerciseById(id: string): Promise<Exercise | null> {
  const exercises = await getExercises()
  return exercises.find((e) => e.id === id) || null
}

export async function addExercise(exercise: Exercise): Promise<void> {
  const exercises = await getExercises()
  exercises.push(exercise)
  await saveExercises(exercises)
}

export async function updateExercise(id: string, updates: Partial<Exercise>): Promise<void> {
  const exercises = await getExercises()
  const index = exercises.findIndex((e) => e.id === id)
  
  if (index !== -1) {
    exercises[index] = { ...exercises[index], ...updates }
    await saveExercises(exercises)
  }
}

export async function deleteExercise(id: string): Promise<boolean> {
  const exercises = await getExercises()
  const filtered = exercises.filter((e) => e.id !== id)
  
  if (filtered.length !== exercises.length) {
    await saveExercises(filtered)
    return true
  }
  
  return false
}
```

#### Bước 4: Cập Nhật API Routes

Thay đổi `lib/database.ts`:

```typescript
// Use KV if available, otherwise use in-memory
export * from process.env.KV_REST_API_URL 
  ? './database-kv' 
  : './database-memory'
```

#### Bước 5: Thêm Environment Variables

Trong Vercel Dashboard:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

### Option 2: Vercel Blob Storage (Cho Files)

#### Bước 1: Tạo Vercel Blob

1. Vào Vercel Dashboard
2. **Storage** > **Create Database** > **Blob**
3. Copy token

#### Bước 2: Cài Đặt

```bash
npm install @vercel/blob
```

#### Bước 3: Cập Nhật Storage

Tạo file `lib/storage-blob.ts`:

```typescript
import { put, list, del } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'

export async function saveFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<string> {
  const fileId = uuidv4()
  const fileExtension = originalName.split('.').pop() || ''
  const fileName = `${fileId}.${fileExtension}`
  
  const blob = await put(fileName, buffer, {
    access: 'public',
    contentType: mimeType,
  })
  
  return blob.url
}

export async function deleteFile(url: string): Promise<boolean> {
  try {
    await del(url)
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}
```

#### Bước 4: Thêm Environment Variable

- `BLOB_READ_WRITE_TOKEN`

## Tóm Tắt

### Để Deploy Ngay (Không Cần Cấu Hình)
✅ Code đã được cập nhật tự động
✅ Chỉ cần `git push` và `vercel deploy`
✅ Ứng dụng sẽ chạy (với giới hạn dữ liệu mất khi restart)

### Để Production (Cần Cấu Hình)
1. Cấu hình Vercel KV cho database
2. Cấu hình Vercel Blob cho file storage
3. Cập nhật code để sử dụng KV và Blob
4. Thêm environment variables

## Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trong Vercel Dashboard
2. Đảm bảo environment variables đã được set
3. Kiểm tra function logs để xem lỗi chi tiết

