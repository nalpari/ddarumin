import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { format } from '@/lib/utils'
import {
  Coffee,
  MessageSquare,
  PartyPopper,
  Calendar,
} from 'lucide-react'

interface Activity {
  id: string
  type: 'inquiry' | 'application' | 'menu' | 'event'
  title: string
  time: Date
  status: string
}

interface ActivityListProps {
  activities: Activity[]
}

const TYPE_ICONS = {
  inquiry: MessageSquare,
  application: Calendar,
  menu: Coffee,
  event: PartyPopper,
}

const STATUS_VARIANTS = {
  PENDING: 'warning',
  COMPLETED: 'success',
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  NEW: 'default',
  WAITING: 'warning',
  EXPIRED: 'secondary',
} as const

export function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">최근 활동이 없습니다</p>
      </Card>
    )
  }

  return (
    <Card>
      <div className="divide-y">
        {activities.map((activity) => {
          const Icon = TYPE_ICONS[activity.type]
          const variant = STATUS_VARIANTS[activity.status as keyof typeof STATUS_VARIANTS] || 'default'
          
          return (
            <div key={`${activity.type}-${activity.id}`} className="p-4 flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(activity.time), 'yyyy-MM-dd HH:mm')}
                </p>
              </div>
              {activity.status && (
                <Badge variant={variant} className="text-xs">
                  {getStatusLabel(activity.status)}
                </Badge>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: '대기중',
    COMPLETED: '완료',
    ACTIVE: '활성',
    INACTIVE: '비활성',
    NEW: '신규',
    WAITING: '대기',
    EXPIRED: '종료',
  }
  return labels[status] || status
}