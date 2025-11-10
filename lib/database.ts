import { Exercise } from '@/types'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'exercises.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read exercises from file
export function getExercises(): Exercise[] {
  ensureDataDirectory()
  
  if (!fs.existsSync(DATA_FILE)) {
    return []
  }

  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading exercises:', error)
    return []
  }
}

// Save exercises to file
export function saveExercises(exercises: Exercise[]): void {
  ensureDataDirectory()
  
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(exercises, null, 2))
  } catch (error) {
    console.error('Error saving exercises:', error)
    throw error
  }
}

// Get exercise by ID
export function getExerciseById(id: string): Exercise | null {
  const exercises = getExercises()
  return exercises.find((e) => e.id === id) || null
}

// Add exercise
export function addExercise(exercise: Exercise): void {
  const exercises = getExercises()
  exercises.push(exercise)
  saveExercises(exercises)
}

// Update exercise
export function updateExercise(id: string, updates: Partial<Exercise>): void {
  const exercises = getExercises()
  const index = exercises.findIndex((e) => e.id === id)
  
  if (index !== -1) {
    exercises[index] = { ...exercises[index], ...updates }
    saveExercises(exercises)
  }
}

// Delete exercise
export function deleteExercise(id: string): boolean {
  const exercises = getExercises()
  const filtered = exercises.filter((e) => e.id !== id)
  
  if (filtered.length !== exercises.length) {
    saveExercises(filtered)
    return true
  }
  
  return false
}

