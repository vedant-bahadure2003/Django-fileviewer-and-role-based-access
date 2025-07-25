'use client'

import { useAuth } from '@/lib/auth-context'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { StatsCard } from '@/components/StatsCard'
import { ActivityLog } from '@/components/ActivityLog'
import { FileSelector } from '@/components/FileSelector'
import { Files, Users, TrendingUp, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ManagerDashboard() {
  const { user } = useAuth()

  const stats = [
    { title: 'Available Files', value: '156', icon: Files, color: 'gradient-bg' },
    { title: 'Team Members', value: '8', icon: Users, color: 'gradient-bg-alt' },
    { title: 'Files Accessed', value: '43', icon: TrendingUp, color: 'gradient-bg-success' },
    { title: 'Recent Views', value: '12', icon: Eye, color: 'gradient-bg-warning' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}. Manage your team's file access.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="files" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="files">File Access</TabsTrigger>
            <TabsTrigger value="team">Team Activity</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>File Access</CardTitle>
                <CardDescription>
                  View and download files with manager-level permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileSelector />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Activity</CardTitle>
                <CardDescription>
                  Monitor your team's file access and activity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityLog />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Access Reports</CardTitle>
                <CardDescription>
                  Generate and view file access reports.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Report generation coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  )
}