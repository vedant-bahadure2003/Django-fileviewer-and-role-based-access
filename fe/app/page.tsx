'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Shield, 
  Users, 
  Download, 
  Eye, 
  ArrowRight, 
  CheckCircle,
  Cloud,
  HardDrive,
  Zap,
  Lock,
  Activity,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!loading && user) {
      router.replace(`/dashboard/${user.role.toLowerCase()}`)
    }
  }, [user, loading, router])

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading FileVault...</p>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Admin, Manager, and Employee roles with granular permissions",
      color: "gradient-bg"
    },
    {
      icon: Cloud,
      title: "Google Drive Integration",
      description: "Seamless fallback to Google Drive for remote file access",
      color: "gradient-bg-alt"
    },
    {
      icon: HardDrive,
      title: "Local File System",
      description: "Fast access to locally stored files with instant viewing",
      color: "gradient-bg-success"
    },
    {
      icon: Activity,
      title: "Activity Monitoring",
      description: "Complete audit trail of file access and user activities",
      color: "gradient-bg-warning"
    }
  ]

  const roles = [
    {
      name: "Admin",
      description: "Full system access with user management capabilities",
      permissions: ["Manage Users", "View All Files", "System Settings", "Audit Logs"],
      color: "from-red-500 to-pink-500",
      icon: Shield
    },
    {
      name: "Manager", 
      description: "Team oversight with enhanced file access permissions",
      permissions: ["Team Management", "File Access", "Activity Reports", "Download Files"],
      color: "from-blue-500 to-cyan-500",
      icon: Users
    },
    {
      name: "Employee",
      description: "Standard file access with viewing and download capabilities",
      permissions: ["View Files", "Download Files", "Personal Dashboard", "File Search"],
      color: "from-green-500 to-emerald-500",
      icon: Eye
    }
  ]

  const stats = [
    { label: "Secure Files", value: "500+", icon: FileText },
    { label: "Active Users", value: "50+", icon: Users },
    { label: "Daily Downloads", value: "200+", icon: Download },
    { label: "Uptime", value: "99.9%", icon: Zap }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center pulse-glow">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">FileVault</h1>
                <p className="text-xs text-white/70">Role-Based File Management</p>
              </div>
            </div>
            <Link href="/login">
              <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Globe className="mr-2 h-4 w-4" />
            Enterprise File Management Solution
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Secure File Access
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience seamless file management with role-based permissions, Google Drive integration, 
            and enterprise-grade security. Access your files locally or remotely with intelligent fallback systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="gradient-bg hover:opacity-90 text-white px-8 py-4 text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm px-8 py-4 text-lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="glass border-white/20 text-center">
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 text-white mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Built for modern enterprises with advanced security and seamless integration capabilities
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass border-white/20 hover:border-white/40 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Roles Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Role-Based Access Control</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Granular permissions tailored for different organizational roles and responsibilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <Card key={index} className="glass border-white/20 hover:border-white/40 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className={`bg-gradient-to-r ${role.color} w-12 h-12 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <role.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{role.name}</h3>
                    <Badge className={`bg-gradient-to-r ${role.color} text-white border-0 mt-1`}>
                      Role
                    </Badge>
                  </div>
                </div>
                <p className="text-white/70 mb-6 leading-relaxed">{role.description}</p>
                <div className="space-y-3">
                  {role.permissions.map((permission, idx) => (
                    <div key={idx} className="flex items-center text-white/80">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">{permission}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Integration Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Seamless Integration</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Smart file management with local storage and Google Drive fallback for maximum availability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="gradient-bg w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                <HardDrive className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Local File System</h3>
                <p className="text-white/70">Lightning-fast access to files stored on your local server with instant viewing capabilities.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="gradient-bg-alt w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Google Drive Fallback</h3>
                <p className="text-white/70">Automatic fallback to Google Drive when files aren't available locally, ensuring 100% availability.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="gradient-bg-success w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Secure Access</h3>
                <p className="text-white/70">Enterprise-grade security with role-based permissions and complete audit trails.</p>
              </div>
            </div>
          </div>

          <Card className="glass border-white/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="gradient-bg w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">File Access Flow</h3>
                <p className="text-white/70">Intelligent file discovery and access</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white">1. Check Local Storage</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white">2. Fallback to Google Drive</span>
                  <Cloud className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white">3. Download & Cache</span>
                  <Download className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <span className="text-white">4. Open in Viewer</span>
                  <Eye className="h-5 w-5 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 py-20">
        <Card className="glass border-white/20 text-center">
          <CardContent className="p-12">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of organizations already using FileVault for secure, role-based file management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="gradient-bg hover:opacity-90 text-white px-8 py-4 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm px-8 py-4 text-lg">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section> <Footer/> </section>
    </div>
  )
}