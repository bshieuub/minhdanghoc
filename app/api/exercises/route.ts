import { NextRequest, NextResponse } from 'next/server'
import { getExercises, deleteExercise } from '@/lib/database'

export async function GET() {
  try {
    const exercises = getExercises()
    return NextResponse.json({ exercises })
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Exercise ID is required' },
        { status: 400 }
      )
    }

    const success = deleteExercise(id)
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

