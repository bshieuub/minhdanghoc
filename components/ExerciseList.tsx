'use client'

import { BookOpen, Play, Trash2, Trophy, Calendar } from 'lucide-react'
import { Exercise, Subject } from '@/types'
import { useRouter } from 'next/navigation'

interface ExerciseListProps {
  exercises: Exercise[]
  onDelete: (id: string, title: string) => void
  getSubjectIcon: (subject: Subject) => string
  getSubjectColor: (subject: Subject) => string
}

export default function ExerciseList({
  exercises,
  onDelete,
  getSubjectIcon,
  getSubjectColor,
}: ExerciseListProps) {
  const router = useRouter()

  const isImageFile = (filePath?: string) => {
    if (!filePath) return false
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    return imageExtensions.some((ext) => filePath.toLowerCase().endsWith(ext))
  }

  if (exercises.length === 0) {
    return (
      <div className="card max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Chưa có bài tập nào
        </h3>
        <p className="text-gray-500">
          Hãy tải bài tập đầu tiên để bắt đầu học tập! 🎓
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className={`card bg-gradient-to-br ${getSubjectColor(exercise.subject)} text-white relative overflow-hidden`}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 text-8xl opacity-20 transform rotate-12">
            {getSubjectIcon(exercise.subject)}
          </div>

          <div className="relative z-10">
            {/* Thumbnail Image */}
            {exercise.originalFile && isImageFile(exercise.originalFile) && (
              <div className="mb-4 rounded-lg overflow-hidden border-2 border-white border-opacity-30">
                <img
                  src={exercise.originalFile}
                  alt={exercise.title}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="text-3xl mb-2">
                  {getSubjectIcon(exercise.subject)}
                </div>
                <h3 className="text-xl font-bold mb-1 line-clamp-2">
                  {exercise.title}
                </h3>
                <div className="text-sm opacity-90 flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(exercise.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="opacity-90">Số câu hỏi:</span>
                <span className="font-bold">{exercise.questions.length}</span>
              </div>
              {exercise.completed && exercise.score !== undefined && (
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-90">Điểm số:</span>
                  <span className="font-bold flex items-center gap-1">
                    <Trophy size={16} />
                    {exercise.score}/{exercise.maxScore || exercise.questions.length * 10}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => router.push(`/exercise/${exercise.id}`)}
                className="flex-1 bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Play size={18} />
                {exercise.completed ? 'Xem Lại' : 'Làm Bài'}
              </button>
              <button
                onClick={() => onDelete(exercise.id, exercise.title)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
                title="Xóa bài tập"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

