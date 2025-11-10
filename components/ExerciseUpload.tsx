'use client'

import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Subject } from '@/types'
import Image from 'next/image'

interface ExerciseUploadProps {
  onSuccess: () => void
}

export default function ExerciseUpload({ onSuccess }: ExerciseUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState<Subject>('Toán')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreview(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !title.trim()) {
      toast.error('📝 Vui lòng điền đầy đủ thông tin!')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('subject', subject)

      const response = await fetch('/api/exercises/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('🎉 Bài tập đã được tạo thành công!')
        setFile(null)
        setTitle('')
        setPreview(null)
        onSuccess()
      } else {
        toast.error(data.error || '❌ Có lỗi xảy ra khi tải bài tập')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('❌ Có lỗi xảy ra khi tải bài tập')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          📤 Tải Bài Tập Mới
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📝 Tên Bài Tập
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Bài tập Toán lớp 3"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Subject Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📚 Môn Học
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="Toán">🔢 Toán</option>
            <option value="Tiếng Việt">📖 Tiếng Việt</option>
            <option value="Tiếng Anh">🇬🇧 Tiếng Anh</option>
            <option value="Khác">📝 Khác</option>
          </select>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📄 File Bài Tập (PDF hoặc Hình Ảnh)
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              required
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              {preview ? (
                <div className="relative w-full h-full">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-contain rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                      setPreview(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : file ? (
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <div className="text-gray-700 font-semibold">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <div className="text-gray-600 font-semibold">
                    Nhấn để chọn file
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    PDF, PNG, JPG (tối đa 10MB)
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || !file || !title.trim()}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Upload size={20} />
              Tải Bài Tập Lên
            </>
          )}
        </button>
      </form>
    </div>
  )
}

