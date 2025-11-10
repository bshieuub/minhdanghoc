import { NextRequest, NextResponse } from 'next/server'
import { getExerciseById, updateExercise } from '@/lib/database'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { answers, score, maxScore } = await request.json()

    const exercise = getExerciseById(params.id)
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      )
    }

    // Update questions with user answers
    const updatedQuestions = exercise.questions.map((q) => ({
      ...q,
      userAnswer: answers[q.id],
    }))

    // Update exercise
    updateExercise(params.id, {
      questions: updatedQuestions,
      completed: true,
      score,
      maxScore,
    })

    return NextResponse.json({
      message: 'Exercise submitted successfully',
      score,
      maxScore,
    })
  } catch (error) {
    console.error('Error submitting exercise:', error)
    return NextResponse.json(
      { error: 'Failed to submit exercise' },
      { status: 500 }
    )
  }
}

