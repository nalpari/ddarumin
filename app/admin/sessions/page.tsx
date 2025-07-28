import { getStartupSessions } from '@/lib/actions/session-actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { SessionTable } from '@/components/admin/sessions/session-table'
import { SessionFormDialog } from '@/components/admin/sessions/session-form-dialog'

export default async function SessionsPage() {
  const sessions = await getStartupSessions()

  return (
    <div>
      <PageHeader
        title="창업설명회 관리"
        description="창업설명회 일정을 관리하고 신청자를 확인합니다"
      />
      <SessionFormDialog />
      <SessionTable sessions={sessions} />
    </div>
  )
}