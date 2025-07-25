import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Mock authentication - replace with real authentication logic
    const mockUsers = {
      'admin': {
        id: '1',
        name: 'John Admin',
        username: 'admin',
        role: 'Admin' as const,
        email: 'admin@filevault.com',
        password: 'password'
      },
      'manager': {
        id: '2',
        name: 'Jane Manager',
        username: 'manager',
        role: 'Manager' as const,
        email: 'manager@filevault.com',
        password: 'password'
      },
      'employee': {
        id: '3',
        name: 'Bob Employee',
        username: 'employee',
        role: 'Employee' as const,
        email: 'employee@filevault.com',
        password: 'password'
      }
    }

    const user = mockUsers[username as keyof typeof mockUsers]
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}