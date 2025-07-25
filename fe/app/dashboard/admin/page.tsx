'use client'

import { useAuth } from '@/lib/auth-context'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { StatsCard } from '@/components/StatsCard'
import { ActivityLog } from '@/components/ActivityLog'
import { UserManagement } from '@/components/UserManagement'
import { FileSelector } from '@/components/FileSelector'
import { Users, Files, Activity, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminDashboard() {
  const { user } = useAuth()

  const stats = [
    { title: 'Total Users', value: '12', icon: Users, color: 'gradient-bg' },
    { title: 'Total Files', value: '234', icon: Files, color: 'gradient-bg-alt' },
    { title: 'Active Sessions', value: '8', icon: Activity, color: 'gradient-bg-success' },
    { title: 'Security Alerts', value: '2', icon: Shield, color: 'gradient-bg-warning' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}. Here's your system overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="files" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="files">File Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>File Management</CardTitle>
                <CardDescription>
                  Manage and view all system files with full administrative access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileSelector />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>
                  Monitor system activity and user actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityLog />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">System settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  )
}