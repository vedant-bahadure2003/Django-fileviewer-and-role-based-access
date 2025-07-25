'use client'

import { FileText, Github, Twitter, Linkedin, Mail, Phone, MapPin, Shield, Cloud, Activity } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Security', href: '#security' },
      { name: 'Integrations', href: '#integrations' },
      { name: 'API Documentation', href: '#api' },
      { name: 'Pricing', href: '#pricing' }
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Blog', href: '#blog' },
      { name: 'Press Kit', href: '#press' },
      { name: 'Contact', href: '#contact' }
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Documentation', href: '#docs' },
      { name: 'System Status', href: '#status' },
      { name: 'Community', href: '#community' },
      { name: 'Training', href: '#training' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR Compliance', href: '#gdpr' },
      { name: 'Security Policy', href: '#security-policy' }
    ]
  }

  const features = [
    { icon: Shield, text: 'Role-Based Access Control' },
    { icon: Cloud, text: 'Google Drive Integration' },
    { icon: Activity, text: 'Real-time Activity Monitoring' }
  ]

  const socialLinks = [
    { icon: Github, href: '#github', label: 'GitHub' },
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' }
  ]

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-t border-white/10 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center pulse-glow">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">FileVault</h3>
                <p className="text-xs text-white/70">Enterprise File Management</p>
              </div>
            </div>
            
            <p className="text-white/70 mb-6 leading-relaxed">
              Secure, role-based file management solution with seamless Google Drive integration 
              and enterprise-grade security features.
            </p>

            {/* Key Features */}
            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-white/80">
                  <feature.icon className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <Link key={index} href={social.href}>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
                  >
                    <social.icon className="h-4 w-4" />
                    <span className="sr-only">{social.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-3">
                  {footerLinks.product.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.href} 
                        className="text-white/70 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.href} 
                        className="text-white/70 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-3">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.href} 
                        className="text-white/70 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.href} 
                        className="text-white/70 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* Newsletter */}
              <div>
                <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
                <p className="text-white/70 text-sm mb-4">
                  Get the latest updates on new features and security enhancements.
                </p>
                <div className="space-y-3">
                  <Input 
                    placeholder="Enter your email" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  />
                  <Button className="w-full gradient-bg hover:opacity-90 text-white">
                    Subscribe
                  </Button>
                </div>
              </div>

              {/* Contact Info */}
              <Card className="glass border-white/20">
                <CardContent className="p-4">
                  <h4 className="text-white font-semibold mb-3">Contact Info</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-white/70 text-sm">
                      <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span>support@filevault.com</span>
                    </div>
                    <div className="flex items-center text-white/70 text-sm">
                      <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center text-white/70 text-sm">
                      <MapPin className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span>San Francisco, CA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-white/70 text-sm">
                © {currentYear} FileVault. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-white/60">
                <span className="flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  SOC 2 Compliant
                </span>
                <span className="flex items-center">
                  <Cloud className="h-3 w-3 mr-1" />
                  99.9% Uptime
                </span>
                <span className="flex items-center">
                  <Activity className="h-3 w-3 mr-1" />
                  24/7 Monitoring
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}