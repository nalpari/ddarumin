import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface StatCardProps {
  title: string
  icon: LucideIcon
  stats: Array<{
    label: string
    value: number
  }>
  href: string
}

export function StatCard({ title, icon: Icon, stats, href }: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}