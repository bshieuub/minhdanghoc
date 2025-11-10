// In-memory database for Vercel deployment (temporary solution)
// Data will be lost on server restart, but allows deployment without database setup
// For production, use Vercel KV, Postgres, or other database services

import { Exercise } from '@/types'

// In-memory storage
let exercisesStore: Exercise[] = []

// Check if we're on Vercel (serverless environment)
const isVercel = process.env.VERCEL === '1'

export function getExercises(): Exercise[] {
  if (isVercel) {
    // On Vercel, use in-memory storage
    return exercisesStore
  }
  
  // Fallback to file system (for local development)
  try {
    const fs = require('fs')
    const path = require('path')
    const DATA_FILE = path.join(process.cwd(), 'data', 'exercises.json')
    
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading from file system, using in-memory:', error)
  }
  
  return exercisesStore
}

export function saveExercises(exercises: Exercise[]): void {
  exercisesStore = exercises
  
  // Try to save to file system if not on Vercel
  if (!isVercel) {
    try {
      const fs = require('fs')
      const path = require('path')
      const DATA_FILE = path.join(process.cwd(), 'data', 'exercises.json')
      const dataDir = path.dirname(DATA_FILE)
      
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      
      fs.writeFileSync(DATA_FILE, JSON.stringify(exercises, null, 2))
    } catch (error) {
      console.error('Error saving to file system, using in-memory:', error)
    }
  }
}

export function getExerciseById(id: string): Exercise | null {
  const exercises = getExercises()
  return exercises.find((e) => e.id === id) || null
}

export function addExercise(exercise: Exercise): void {
  const exercises = getExercises()
  exercises.push(exercise)
  saveExercises(exercises)
}

export function updateExercise(id: string, updates: Partial<Exercise>): void {
  const exercises = getExercises()
  const index = exercises.findIndex((e) => e.id === id)
  
  if (index !== -1) {
    exercises[index] = { ...exercises[index], ...updates }
    saveExercises(exercises)
  }
}

export function deleteExercise(id: string): boolean {
  const exercises = getExercises()
  const filtered = exercises.filter((e) => e.id !== id)
  
  if (filtered.length !== exercises.length) {
    saveExercises(filtered)
    return true
  }
  
  return false
}

