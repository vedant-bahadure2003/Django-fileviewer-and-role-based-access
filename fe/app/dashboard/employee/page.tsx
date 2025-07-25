'use client'

import { useAuth } from '@/lib/auth-context'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { StatsCard } from '@/components/StatsCard'
import { FileSelector } from '@/components/FileSelector'
import { Files, Download, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function EmployeeDashboard() {
  const { user } = useAuth()

  const stats = [
    { title: 'Available Files', value: '23', icon: Files, color: 'gradient-bg' },
    { title: 'Downloaded', value: '8', icon: Download, color: 'gradient-bg-alt' },
    { title: 'Recent Access', value: '5', icon: Clock, color: 'gradient-bg-success' },
    { title: 'Completed Tasks', value: '12', icon: CheckCircle, color: 'gradient-bg-warning' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Employee Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}. Access your assigned files.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* File Access Card */}
        <Card>
          <CardHeader>
            <CardTitle>File Access</CardTitle>
            <CardDescription>
              View and download files you have access to.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileSelector />
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}