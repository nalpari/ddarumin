import { getDashboardStats, getRecentActivities } from '@/lib/actions/dashboard-actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatCard } from '@/components/admin/dashboard/stat-card'
import { ActivityList } from '@/components/admin/dashboard/activity-list'
import {
  Coffee,
  Store,
  PartyPopper,
  MessageSquare,
  HelpCircle,
  Calendar,
} from 'lucide-react'

export default async function AdminDashboard() {
  const [stats, activities] = await Promise.all([
    getDashboardStats(),
    getRecentActivities(),
  ])

  return (
    <div>
      <PageHeader
        title="대시보드"
        description="힘이나는커피생활 관리자 대시보드"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="메뉴 관리"
          icon={Coffee}
          stats={[
            { label: '전체 메뉴', value: stats.menus.total },
            { label: '활성 메뉴', value: stats.menus.active },
          ]}
          href="/admin/menus/items"
        />
        
        <StatCard
          title="매장 관리"
          icon={Store}
          stats={[
            { label: '전체 매장', value: stats.stores.total },
            { label: '운영중', value: stats.stores.operating },
          ]}
          href="/admin/stores"
        />
        
        <StatCard
          title="이벤트 관리"
          icon={PartyPopper}
          stats={[
            { label: '전체 이벤트', value: stats.events.total },
            { label: '진행중', value: stats.events.active },
          ]}
          href="/admin/events"
        />
        
        <StatCard
          title="가맹문의"
          icon={MessageSquare}
          stats={[
            { label: '전체 문의', value: stats.inquiries.total },
            { label: '대기중', value: stats.inquiries.pending },
          ]}
          href="/admin/franchise"
        />
        
        <StatCard
          title="FAQ"
          icon={HelpCircle}
          stats={[
            { label: '전체 FAQ', value: stats.faqs.total },
            { label: '활성 FAQ', value: stats.faqs.active },
          ]}
          href="/admin/posts/faqs"
        />
        
        <StatCard
          title="창업설명회"
          icon={Calendar}
          stats={[
            { label: '전체 설명회', value: stats.sessions.total },
            { label: '접수중', value: stats.sessions.upcoming },
          ]}
          href="/admin/sessions"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">최근 활동</h2>
        <ActivityList activities={activities} />
      </div>
    </div>
  )
}