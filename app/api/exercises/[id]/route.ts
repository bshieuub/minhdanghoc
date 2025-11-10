import { NextRequest, NextResponse } from 'next/server'
import { getExerciseById, deleteExercise } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exercise = getExerciseById(params.id)
    if (exercise) {
      return NextResponse.json({ exercise })
    } else {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error fetching exercise:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exercise' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteExercise(params.id)
    if (success) {
      return NextResponse.json({ message: 'Exercise deleted successfully' })
    } else {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error deleting exercise:', error)
    return NextResponse.json(
      { error: 'Failed to delete exercise' },
      { status: 500 }
    )
  }
}

