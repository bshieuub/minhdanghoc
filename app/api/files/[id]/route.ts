import { NextRequest, NextResponse } from 'next/server'
import { getFile } from '@/lib/storage-memory'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const file = getFile(params.id)
    
    if (file) {
      // Convert Base64 to buffer
      const buffer = Buffer.from(file.data, 'base64')
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': file.type,
          'Content-Disposition': `inline; filename="${file.name}"`,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }
    
    // Try to serve from file system (for local development or files uploaded before)
    // This handles legacy files from file system storage
    try {
      const fs = require('fs')
      const path = require('path')
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      
      if (fs.existsSync(uploadsDir)) {
        // Try to find file by ID (UUID) in filename
        const files = fs.readdirSync(uploadsDir)
        const matchingFile = files.find((f: string) => {
          // Extract UUID from filename (format: uuid.extension)
          const fileId = f.split('.')[0]
          return fileId === params.id
        })
        
        if (matchingFile) {
          const filePath = path.join(uploadsDir, matchingFile)
          const fileBuffer = fs.readFileSync(filePath)
          
          // Determine MIME type from extension
          let mimeType = 'application/octet-stream'
          const ext = matchingFile.split('.').pop()?.toLowerCase()
          const mimeTypes: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'pdf': 'application/pdf',
          }
          if (ext && mimeTypes[ext]) {
            mimeType = mimeTypes[ext]
          }
          
          return new NextResponse(fileBuffer, {
            headers: {
              'Content-Type': mimeType,
              'Content-Disposition': `inline; filename="${matchingFile}"`,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          })
        }
      }
    } catch (error) {
      // Silently fail - file not in file system, which is OK
      console.log('File not found in file system (expected for in-memory storage):', params.id)
    }
    
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error serving file:', error)
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    )
  }
}

