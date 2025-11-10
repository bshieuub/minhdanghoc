export type Subject = 'Tiếng Việt' | 'Toán' | 'Tiếng Anh' | 'Khác'

export interface Question {
  id: string
  question: string
  type: 'multiple-choice' | 'fill-in-blank' | 'essay'
  options?: string[]
  correctAnswer: string | string[]
  userAnswer?: string | string[]
  points: number
}

export interface Exercise {
  id: string
  title: string
  subject: Subject
  questions: Question[]
  createdAt: string
  completed?: boolean
  score?: number
  maxScore?: number
  originalFile?: string
}

export interface PraiseMessage {
  message: string
  emoji: string
}

