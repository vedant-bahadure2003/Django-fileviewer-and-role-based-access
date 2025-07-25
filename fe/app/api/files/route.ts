import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Mock file data - replace with real file system/database queries
  const mockFiles = [
    {
      id: '1',
      name: 'project-specifications.txt',
      size: '45 KB',
      lastModified: '2024-01-15 10:30',
      type: 'local'
    },
    {
      id: '2',
      name: 'user-manual.txt',
      size: '128 KB',
      lastModified: '2024-01-14 16:45',
      type: 'remote'
    },
    {
      id: '3',
      name: 'team-guidelines.txt',
      size: '67 KB',
      lastModified: '2024-01-13 09:15',
      type: 'local'
    },
    {
      id: '4',
      name: 'api-documentation.txt',
      size: '234 KB',
      lastModified: '2024-01-12 14:20',
      type: 'remote'
    },
    {
      id: '5',
      name: 'security-policies.txt',
      size: '89 KB',
      lastModified: '2024-01-11 11:30',
      type: 'local'
    },
    {
      id: '6',
      name: 'deployment-guide.txt',
      size: '156 KB',
      lastModified: '2024-01-10 13:45',
      type: 'remote'
    }
  ]

  return NextResponse.json({
    success: true,
    files: mockFiles
  })
}