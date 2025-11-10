'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ExerciseView from '@/components/ExerciseView'
import { Exercise } from '@/types'

export default function ExercisePage() {
  const params = useParams()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadExercise(params.id as string)
    }
  }, [params.id])

  const loadExercise = async (id: string) => {
    try {
      const response = await fetch(`/api/exercises/${id}`)
      if (response.ok) {
        const data = await response.json()
        setExercise(data.exercise)
      }
    } catch (error) {
      console.error('Error loading exercise:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-bounce">📚</div>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800">
            Không tìm thấy bài tập
          </h2>
        </div>
      </div>
    )
  }

  return <ExerciseView exercise={exercise} />
}

