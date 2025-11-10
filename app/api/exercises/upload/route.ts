import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { addExercise } from '@/lib/database'
import { Exercise, Subject, Question } from '@/types'
import { extractTextFromImage, parseExerciseFromText } from '@/lib/ocr'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const subject = formData.get('subject') as Subject

    if (!file || !title) {
      return NextResponse.json(
        { error: 'File and title are required' },
        { status: 400 }
      )
    }

    // Read file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileExtension = path.extname(file.name).toLowerCase()

    let questions: Question[] = []

    // Process image files with OCR
    if (['.png', '.jpg', '.jpeg'].includes(fileExtension)) {
      try {
        const extractedText = await extractTextFromImage(buffer)
        questions = await parseExerciseFromText(extractedText, subject)
      } catch (error) {
        console.error('OCR Error:', error)
        // parseExerciseFromText will create sample questions if text is empty
        questions = await parseExerciseFromText('', subject)
      }
    } else if (fileExtension === '.pdf') {
      // For PDF, create sample questions based on subject
      // In production, you might want to use pdf-parse or similar
      questions = await parseExerciseFromText('', subject)
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      )
    }

    // Ensure we have at least one question
    if (questions.length === 0) {
      questions = await parseExerciseFromText('', subject)
    }

    // Save file to public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const fileName = `${uuidv4()}${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    // Create exercise
    const exercise: Exercise = {
      id: uuidv4(),
      title,
      subject,
      questions,
      createdAt: new Date().toISOString(),
      completed: false,
      originalFile: `/uploads/${fileName}`,
    }

    // Save exercise
    addExercise(exercise)

    return NextResponse.json({
      message: 'Exercise uploaded successfully',
      exercise,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload exercise' },
      { status: 500 }
    )
  }
}

