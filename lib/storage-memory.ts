// In-memory file storage for Vercel deployment (temporary solution)
// Files are stored as Base64 in memory - will be lost on server restart
// For production, use Vercel Blob Storage, AWS S3, or Cloudinary

import { v4 as uuidv4 } from 'uuid'

interface StoredFile {
  id: string
  name: string
  data: string // Base64 encoded
  type: string
  size: number
  uploadedAt: string
}

// In-memory file storage
const fileStore: Map<string, StoredFile> = new Map()

// Check if we're on Vercel
const isVercel = process.env.VERCEL === '1'

/**
 * Save file to storage
 * @param buffer File buffer
 * @param originalName Original file name
 * @param mimeType MIME type
 * @returns Public URL to access the file
 */
export async function saveFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<string> {
  const fileId = uuidv4()
  const fileExtension = originalName.split('.').pop() || ''
  const fileName = `${fileId}.${fileExtension}`
  
  // Convert buffer to Base64
  const base64Data = buffer.toString('base64')
  
  const storedFile: StoredFile = {
    id: fileId,
    name: fileName,
    data: base64Data,
    type: mimeType,
    size: buffer.length,
    uploadedAt: new Date().toISOString(),
  }
  
  fileStore.set(fileId, storedFile)
  
  // Try to save to file system if not on Vercel
  if (!isVercel) {
    try {
      const fs = require('fs').promises
      const path = require('path')
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      
      await fs.mkdir(uploadsDir, { recursive: true })
      const filePath = path.join(uploadsDir, fileName)
      await fs.writeFile(filePath, buffer)
      
      return `/uploads/${fileName}`
    } catch (error) {
      console.error('Error saving to file system, using in-memory:', error)
    }
  }
  
  // Return API endpoint to serve the file
  return `/api/files/${fileId}`
}

/**
 * Get file data
 * @param fileId File ID
 * @returns File data or null if not found
 */
export function getFile(fileId: string): StoredFile | null {
  return fileStore.get(fileId) || null
}

/**
 * Delete file
 * @param fileId File ID
 * @returns true if deleted, false if not found
 */
export function deleteFile(fileId: string): boolean {
  return fileStore.delete(fileId)
}

/**
 * Extract file ID from URL
 * @param url File URL
 * @returns File ID or null
 */
export function extractFileIdFromUrl(url: string): string | null {
  // Handle both /uploads/ and /api/files/ URLs
  if (url.startsWith('/api/files/')) {
    return url.replace('/api/files/', '')
  }
  if (url.startsWith('/uploads/')) {
    // For file system storage, try to extract ID from filename
    const fileName = url.split('/').pop()
    if (fileName) {
      return fileName.split('.')[0]
    }
  }
  return null
}

