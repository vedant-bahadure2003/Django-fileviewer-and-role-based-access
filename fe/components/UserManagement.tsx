'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Search, MoreVertical, Edit, Trash2, UserPlus, Shield } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'Employee'
  status: 'Active' | 'Inactive'
  lastLogin: string
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@filevault.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2024-01-15 10:30'
    },
    {
      id: '2',
      name: 'Jane Manager',
      email: 'manager@filevault.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: '2024-01-15 09:15'
    },
    {
      id: '3',
      name: 'Bob Employee',
      email: 'employee@filevault.com',
      role: 'Employee',
      status: 'Active',
      lastLogin: '2024-01-14 16:45'
    },
    {
      id: '4',
      name: 'Alice Smith',
      email: 'alice@filevault.com',
      role: 'Employee',
      status: 'Inactive',
      lastLogin: '2024-01-10 14:20'
    }
  ])

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Employee': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gradient-bg text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last login: {user.lastLogin}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={getRoleColor(user.role)}>
                    <Shield className="mr-1 h-3 w-3" />
                    {user.role}
                  </Badge>
                  
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}