'use client'

import { Trash2, X } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="text-red-600" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Xóa Bài Tập</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            🗑️ Bạn có chắc chắn muốn xóa bài tập này không?
          </p>
          <p className="text-sm text-gray-500 font-semibold bg-gray-100 p-3 rounded-lg">
            &quot;{title}&quot;
          </p>
          <p className="text-sm text-red-600 mt-3">
            ⚠️ Hành động này không thể hoàn tác!
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Xóa
          </button>
        </div>
      </div>
    </div>
  )
}

