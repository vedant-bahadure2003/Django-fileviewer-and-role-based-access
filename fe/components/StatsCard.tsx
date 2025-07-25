import { Card, CardContent } from '@/components/ui/card'
import { DivideIcon as LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  icon: LucideIcon
  color: string
}

export function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`${color} rounded-full p-3`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className={`absolute inset-0 ${color} opacity-5`}></div>
      </CardContent>
    </Card>
  )
}