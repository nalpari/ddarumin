import { notFound } from 'next/navigation'
import { getStartupSession, getSessionApplicants } from '@/lib/actions/session-actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { Badge } from '@/components/ui/badge'
import { format } from '@/lib/utils'
import { ApplicantTable } from '@/components/admin/sessions/applicant-table'

const LOCATION_LABELS = {
  HEADQUARTERS: '본사',
  SEOUL_OFFICE: '서울사무소',
  MUGYO_BRANCH: '무교점',
  YEOUIDO_BRANCH: '여의도점',
}

const STATUS_LABELS = {
  WAITING: '대기중',
  ACCEPTING: '접수중',
  CLOSED: '마감',
}

export default async function SessionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getStartupSession(params.id)
  
  if (!session) {
    notFound()
  }

  const applicants = await getSessionApplicants(params.id)
  const variant = session.status === 'ACCEPTING' ? 'success' : session.status === 'CLOSED' ? 'secondary' : 'warning'

  return (
    <div>
      <PageHeader
        title={`${session.round}회 창업설명회`}
        description="신청자 목록을 확인하고 관리합니다"
      />

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">설명회 일시</p>
          <p className="font-medium">
            {format(new Date(session.sessionDate), 'yyyy년 MM월 dd일')} {session.sessionTime}
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">장소</p>
          <p className="font-medium">
            {LOCATION_LABELS[session.location as keyof typeof LOCATION_LABELS]}
            {session.additionalLocation && (
              <span className="text-sm text-muted-foreground ml-1">
                ({session.additionalLocation})
              </span>
            )}
          </p>
        </div>
        
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">상태</p>
          <Badge variant={variant}>
            {STATUS_LABELS[session.status]}
          </Badge>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          신청자 목록 ({applicants.length}명)
        </h2>
      </div>

      <ApplicantTable applicants={applicants} />
    </div>
  )
}