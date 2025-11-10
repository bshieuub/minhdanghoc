'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Trophy, ArrowLeft, Sparkles, ZoomIn, FileImage, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Exercise, Question } from '@/types'
import { getPraiseMessage } from '@/utils/praises'

interface ExerciseViewProps {
  exercise: Exercise
}

export default function ExerciseView({ exercise }: ExerciseViewProps) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [showPraise, setShowPraise] = useState(false)
  const [praiseMessage, setPraiseMessage] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    // Load saved answers if exercise was already completed
    if (exercise.completed && exercise.questions) {
      const savedAnswers: Record<string, string | string[]> = {}
      exercise.questions.forEach((q) => {
        if (q.userAnswer) {
          savedAnswers[q.id] = q.userAnswer
        }
      })
      setAnswers(savedAnswers)
      if (exercise.score !== undefined) {
        setScore(exercise.score)
        setSubmitted(true)
      }
    }
  }, [exercise])

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    if (submitted) return
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== exercise.questions.length) {
      toast.error('📝 Vui lòng trả lời tất cả các câu hỏi!')
      return
    }

    // Calculate score
    let totalScore = 0
    let maxScore = 0

    exercise.questions.forEach((question) => {
      maxScore += question.points
      const userAnswer = answers[question.id]
      const correctAnswer = question.correctAnswer

      if (Array.isArray(correctAnswer)) {
        if (
          Array.isArray(userAnswer) &&
          userAnswer.length === correctAnswer.length &&
          userAnswer.every((ans) => correctAnswer.includes(ans))
        ) {
          totalScore += question.points
        }
      } else {
        if (userAnswer === correctAnswer) {
          totalScore += question.points
        }
      }
    })

    const finalScore = Math.round((totalScore / maxScore) * 100)

    setScore(finalScore)
    setSubmitted(true)

    // Get praise message
    const praise = getPraiseMessage(finalScore)
    setPraiseMessage(praise.message + ' ' + praise.emoji)
    setShowPraise(true)

    // Save results to API
    try {
      await fetch(`/api/exercises/${exercise.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          score: finalScore,
          maxScore,
        }),
      })

      toast.success('🎉 Bài tập đã được chấm điểm!')
    } catch (error) {
      console.error('Error submitting exercise:', error)
    }
  }

  const isCorrect = (question: Question) => {
    if (!submitted) return null
    const userAnswer = answers[question.id]
    const correctAnswer = question.correctAnswer

    if (Array.isArray(correctAnswer)) {
      return (
        Array.isArray(userAnswer) &&
        userAnswer.length === correctAnswer.length &&
        userAnswer.every((ans) => correctAnswer.includes(ans))
      )
    }
    return userAnswer === correctAnswer
  }

  const isImageFile = (filePath?: string) => {
    if (!filePath) return false
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    return imageExtensions.some((ext) => filePath.toLowerCase().endsWith(ext))
  }

  const handleImageClick = (imagePath: string) => {
    setSelectedImage(imagePath)
    setShowImageModal(true)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {exercise.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="text-2xl">
              {exercise.subject === 'Toán'
                ? '🔢'
                : exercise.subject === 'Tiếng Việt'
                ? '📖'
                : exercise.subject === 'Tiếng Anh'
                ? '🇬🇧'
                : '📝'}
            </span>
            <span className="font-semibold">{exercise.subject}</span>
          </div>
        </div>

        {/* Praise Message */}
        {showPraise && score !== null && (
          <div className="card mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-6 animate-bounce">
            <div className="text-4xl mb-2">{praiseMessage}</div>
            <div className="text-2xl font-bold">
              Điểm số: {score} điểm! 🎉
            </div>
          </div>
        )}

        {/* Original Image/File Display */}
        {exercise.originalFile && isImageFile(exercise.originalFile) && (
          <div className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileImage size={24} className="text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800">
                📷 Hình Ảnh Bài Tập Gốc
              </h2>
            </div>
            <div 
              className="relative w-full cursor-pointer group"
              onClick={() => handleImageClick(exercise.originalFile!)}
            >
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors bg-gray-50">
                <img
                  src={exercise.originalFile}
                  alt="Bài tập gốc"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-90 rounded-full p-3 shadow-lg">
                    <ZoomIn size={24} className="text-blue-500" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                👆 Click để xem hình ảnh lớn hơn
              </p>
            </div>
          </div>
        )}

        {/* PDF File Display */}
        {exercise.originalFile && !isImageFile(exercise.originalFile) && (
          <div className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileImage size={24} className="text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800">
                📄 File Bài Tập Gốc
              </h2>
            </div>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-600 mb-4">
                File PDF: {exercise.originalFile.split('/').pop()}
              </p>
              <a
                href={exercise.originalFile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FileImage size={18} />
                Mở File PDF
              </a>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {exercise.questions.map((question, index) => (
            <div key={question.id} className="card">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {question.question}
                  </h3>

                  {question.type === 'multiple-choice' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isSelected = answers[question.id] === option
                        const correct = isCorrect(question)
                        const isRightAnswer = option === question.correctAnswer

                        return (
                          <label
                            key={optIndex}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              submitted
                                ? isRightAnswer
                                  ? 'border-green-500 bg-green-50'
                                  : isSelected && !isRightAnswer
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200'
                                : isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={question.id}
                              value={option}
                              checked={isSelected}
                              onChange={() => handleAnswerChange(question.id, option)}
                              disabled={submitted}
                              className="w-5 h-5 text-blue-600"
                            />
                            <span className="flex-1">{option}</span>
                            {submitted && (
                              <>
                                {isRightAnswer && (
                                  <CheckCircle className="text-green-500" size={20} />
                                )}
                                {isSelected && !isRightAnswer && (
                                  <XCircle className="text-red-500" size={20} />
                                )}
                              </>
                            )}
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {question.type === 'fill-in-blank' && (
                    <input
                      type="text"
                      value={answers[question.id] as string || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      disabled={submitted}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                        submitted
                          ? isCorrect(question)
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="Nhập câu trả lời..."
                    />
                  )}

                  {submitted && (
                    <div className="mt-3 text-sm">
                      <span className="font-semibold">Đáp án đúng: </span>
                      <span className="text-green-600">
                        {Array.isArray(question.correctAnswer)
                          ? question.correctAnswer.join(', ')
                          : question.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {!submitted && (
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
            >
              <Trophy size={24} />
              Nộp Bài
            </button>
          </div>
        )}

        {/* Score Display */}
        {submitted && score !== null && (
          <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-8">
            <Trophy size={48} className="mx-auto mb-4" />
            <div className="text-4xl font-bold mb-2">
              {score} điểm
            </div>
            <div className="text-xl">
              {score >= 80
                ? 'Xuất sắc! 🌟'
                : score >= 60
                ? 'Tốt lắm! 👍'
                : 'Cố gắng thêm nhé! 💪'}
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowImageModal(false)
                }}
                className="absolute top-4 right-4 bg-white text-gray-800 rounded-full p-3 hover:bg-gray-200 z-10 shadow-lg transition-transform hover:scale-110"
                aria-label="Đóng"
              >
                <X size={24} />
              </button>
              <div 
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage}
                  alt="Bài tập gốc - phóng to"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              </div>
              <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full">
                Click bên ngoài để đóng
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

