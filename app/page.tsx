'use client'

import { useState, useEffect } from 'react'
import { Upload, BookOpen, Trophy, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import ExerciseList from '@/components/ExerciseList'
import ExerciseUpload from '@/components/ExerciseUpload'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import { Exercise, Subject } from '@/types'

export default function Home() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; exerciseId: string | null; exerciseTitle: string }>({
    isOpen: false,
    exerciseId: null,
    exerciseTitle: '',
  })

  useEffect(() => {
    loadExercises()
  }, [])

  const loadExercises = async () => {
    try {
      const response = await fetch('/api/exercises')
      if (response.ok) {
        const data = await response.json()
        setExercises(data.exercises || [])
      }
    } catch (error) {
      console.error('Error loading exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = () => {
    setShowUpload(false)
    loadExercises()
    toast.success('📚 Bài tập đã được tải lên thành công!')
  }

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      exerciseId: id,
      exerciseTitle: title,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.exerciseId) return

    try {
      const response = await fetch(`/api/exercises/${deleteModal.exerciseId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('✅ Đã xóa bài tập thành công!')
        loadExercises()
      } else {
        toast.error('❌ Có lỗi xảy ra khi xóa bài tập')
      }
    } catch (error) {
      console.error('Error deleting exercise:', error)
      toast.error('❌ Có lỗi xảy ra khi xóa bài tập')
    }
  }

  const getSubjectIcon = (subject: Subject) => {
    const icons: Record<Subject, string> = {
      'Tiếng Việt': '📖',
      'Toán': '🔢',
      'Tiếng Anh': '🇬🇧',
      'Khác': '📝',
    }
    return icons[subject] || '📝'
  }

  const getSubjectColor = (subject: Subject) => {
    const colors: Record<Subject, string> = {
      'Tiếng Việt': 'from-red-400 to-pink-500',
      'Toán': 'from-blue-400 to-cyan-500',
      'Tiếng Anh': 'from-green-400 to-emerald-500',
      'Khác': 'from-purple-400 to-indigo-500',
    }
    return colors[subject] || 'from-gray-400 to-gray-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-bounce">🎓</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎓 Học Tập Cho Minh Đăng 🎓
          </h1>
          <p className="text-xl text-gray-600">
            Chào mừng đến với ứng dụng học tập thú vị! 🌟
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="btn-primary flex items-center gap-3 text-lg"
          >
            {showUpload ? (
              <>
                <BookOpen size={24} />
                Xem Danh Sách Bài Tập
              </>
            ) : (
              <>
                <Upload size={24} />
                Tải Bài Tập Mới
                <Sparkles size={20} />
              </>
            )}
          </button>
        </div>

        {/* Upload Form or Exercise List */}
        {showUpload ? (
          <ExerciseUpload onSuccess={handleUploadSuccess} />
        ) : (
          <ExerciseList
            exercises={exercises}
            onDelete={handleDeleteClick}
            getSubjectIcon={getSubjectIcon}
            getSubjectColor={getSubjectColor}
          />
        )}

        {/* Delete Confirm Modal */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() =>
            setDeleteModal({ isOpen: false, exerciseId: null, exerciseTitle: '' })
          }
          onConfirm={handleDeleteConfirm}
          title={deleteModal.exerciseTitle}
        />

        {/* Stats */}
        {!showUpload && exercises.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-2xl font-bold text-gray-800">
                {exercises.length}
              </div>
              <div className="text-gray-600">Bài Tập</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-gray-800">
                {exercises.filter((e) => e.completed).length}
              </div>
              <div className="text-gray-600">Đã Hoàn Thành</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-gray-800">
                {exercises.length > 0
                  ? Math.round(
                      (exercises.reduce((sum, e) => sum + (e.score || 0), 0) /
                        exercises.length) *
                        10
                    ) / 10
                  : 0}
              </div>
              <div className="text-gray-600">Điểm Trung Bình</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

