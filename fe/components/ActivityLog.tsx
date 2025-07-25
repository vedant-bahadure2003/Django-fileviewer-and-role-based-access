'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Download, Eye, User } from 'lucide-react'
import { filesAPI } from '@/lib/api'

interface ActivityItem {
  id: string
  user: string
  action: 'view' | 'download' | 'login'
  fileName?: string
  timestamp: string
  role: string
}

export function ActivityLog() {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await filesAPI.getActivityLogs()
        const formattedActivities = data.activities.map((activity: any) => ({
          id: activity.id.toString(),
          user: activity.user_name,
          action: activity.action,
          fileName: activity.filename,
          timestamp: activity.timestamp,
          role: activity.user_role
        }))
        setActivities(formattedActivities)
      } catch (error) {
        console.error('Failed to fetch activities:', error)
        // Fallback to empty array
        setActivities([])
      }
    }
    
    fetchActivities()
  }, [])

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'view': return <Eye className="h-4 w-4" />
      case 'download': return <Download className="h-4 w-4" />
      case 'login': return <User className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'view': return 'bg-blue-500'
      case 'download': return 'bg-green-500'
      case 'login': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Manager': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Employee': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className={`${getActionColor(activity.action)} rounded-full p-2`}>
                {getActionIcon(activity.action)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{activity.user}</span>
                    <Badge variant="secondary" className={getRoleColor(activity.role)}>
                      {activity.role}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.action === 'login' 
                    ? 'Logged into the system'
                    : `${activity.action === 'view' ? 'Viewed' : 'Downloaded'} ${activity.fileName}`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}