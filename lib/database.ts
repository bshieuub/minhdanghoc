// Database module - automatically uses in-memory storage on Vercel
// Exports from database-memory which handles both file system and in-memory storage
export {
  getExercises,
  saveExercises,
  getExerciseById,
  addExercise,
  updateExercise,
  deleteExercise,
} from './database-memory'

