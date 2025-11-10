import Tesseract from 'tesseract.js'
import sharp from 'sharp'
import { Question } from '@/types'

export async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  try {
    // Process image to improve OCR accuracy
    const processedImage = await sharp(imageBuffer)
      .greyscale()
      .normalize()
      .sharpen()
      .toBuffer()

    const { data: { text } } = await Tesseract.recognize(processedImage, 'vie+eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`Progress: ${Math.round(m.progress * 100)}%`)
        }
      },
    })

    return text
  } catch (error) {
    console.error('OCR Error:', error)
    throw new Error('Failed to extract text from image')
  }
}

export async function parseExerciseFromText(text: string, subject: string): Promise<Question[]> {
  // Simple parsing logic - in production, you might want to use AI/ML for better parsing
  const lines = text.split('\n').filter((line) => line.trim())
  
  // This is a simplified parser - you can enhance it with AI
  const questions: Question[] = []
  let currentQuestion: Partial<Question> | null = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Check if line is a question number (e.g., "1.", "Câu 1:", etc.)
    if (/^\d+[\.\)]/.test(line) || /^Câu\s+\d+/.test(line)) {
      if (currentQuestion && currentQuestion.question) {
        questions.push(currentQuestion as Question)
      }
      
      currentQuestion = {
        id: `q${questions.length + 1}`,
        question: line,
        type: 'fill-in-blank',
        correctAnswer: 'đáp án',
        points: 10,
      }
    } else if (currentQuestion) {
      // Check if line is an option (A., B., C., D.)
      if (/^[A-D][\.\)]/.test(line)) {
        if (!currentQuestion.options) {
          currentQuestion.options = []
          currentQuestion.type = 'multiple-choice'
        }
        currentQuestion.options.push(line.substring(2).trim())
        // Set correct answer to first option as default
        if (currentQuestion.options.length === 1) {
          currentQuestion.correctAnswer = line
        }
      } else {
        // Append to question text
        currentQuestion.question += ' ' + line
      }
    }
  }
  
  if (currentQuestion && currentQuestion.question) {
    questions.push(currentQuestion as Question)
  }
  
  // If no questions found, create sample questions based on subject
  if (questions.length === 0) {
    if (subject === 'Toán') {
      questions.push(
        {
          id: 'q1',
          question: 'Tính: 2 + 2 = ?',
          type: 'multiple-choice',
          options: ['A. 3', 'B. 4', 'C. 5', 'D. 6'],
          correctAnswer: 'B. 4',
          points: 10,
        },
        {
          id: 'q2',
          question: 'Tính: 5 × 3 = ?',
          type: 'fill-in-blank',
          correctAnswer: '15',
          points: 10,
        }
      )
    } else if (subject === 'Tiếng Việt') {
      questions.push(
        {
          id: 'q1',
          question: 'Từ nào viết đúng chính tả?',
          type: 'multiple-choice',
          options: ['A. học tập', 'B. học tập', 'C. học tập', 'D. học tập'],
          correctAnswer: 'A. học tập',
          points: 10,
        },
        {
          id: 'q2',
          question: 'Điền từ thích hợp: "Minh Đăng rất ... học tập"',
          type: 'fill-in-blank',
          correctAnswer: 'chăm chỉ',
          points: 10,
        }
      )
    } else if (subject === 'Tiếng Anh') {
      questions.push(
        {
          id: 'q1',
          question: 'What is "hello" in Vietnamese?',
          type: 'multiple-choice',
          options: ['A. xin chào', 'B. tạm biệt', 'C. cảm ơn', 'D. xin lỗi'],
          correctAnswer: 'A. xin chào',
          points: 10,
        },
        {
          id: 'q2',
          question: 'Complete: "I ... a student"',
          type: 'fill-in-blank',
          correctAnswer: 'am',
          points: 10,
        }
      )
    } else {
      questions.push({
        id: 'q1',
        question: 'Câu hỏi mẫu: Hãy làm bài tập trong file đã tải lên',
        type: 'essay',
        correctAnswer: '',
        points: 10,
      })
    }
  }
  
  return questions
}

