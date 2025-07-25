import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id

  // Mock Google Drive download - replace with real Google Drive API integration
  // Simulate download delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Mock success response
  return NextResponse.json({
    success: true,
    message: 'File downloaded successfully from Google Drive',
    localPath: `/files/downloaded-${fileId}.txt`
  })
}