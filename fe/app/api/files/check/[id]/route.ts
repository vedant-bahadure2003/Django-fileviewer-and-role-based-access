import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id

  // Mock file existence check - replace with real file system check
  const localFiles = ['1', '3', '5'] // IDs of files that exist locally
  const exists = localFiles.includes(fileId)

  return NextResponse.json({
    success: true,
    exists,
    message: exists 
      ? 'File is available locally' 
      : 'File not available locally',
    downloadAvailable: !exists
  })
}