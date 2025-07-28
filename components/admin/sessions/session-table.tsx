'use client'

import * as React from 'react'
import { SessionStatus } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Trash2, Users } from 'lucide-react'
import { format } from '@/lib/utils'
import { SessionFormDialog } from './session-form-dialog'
import { DeleteDialog } from '@/components/admin/DeleteDialog'
import { deleteStartupSession } from '@/lib/actions/session-actions'
import { useToast } from '@/components/ui/toast'
import Link from 'next/link'

interface SessionWithCount {
  id: string
  round: number
  sessionDate: Date
  sessionTime: string
  location: string
  additionalLocation?: string | null
  registrationStart: Date
  registrationEnd: Date
  status: SessionStatus
  _count: {
    applicants: number
  }
}

interface SessionTableProps {
  sessions: SessionWithCount[]
}

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

export function SessionTable({ sessions }: SessionTableProps) {
  const { showToast } = useToast()
  const [editSession, setEditSession] = React.useState<SessionWithCount | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteStartupSession(deleteId)
    if (result.success) {
      showToast({
        title: '창업설명회가 삭제되었습니다',
        variant: 'success',
      })
    } else {
      showToast({
        title: '삭제 실패',
        description: result.error,
        variant: 'destructive',
      })
    }
    setDeleteId(null)
  }

  const columns: ColumnDef<SessionWithCount>[] = [
    {
      accessorKey: 'round',
      header: '회차',
      cell: ({ row }) => `${row.getValue('round')}회`,
    },
    {
      accessorKey: 'sessionDate',
      header: '설명회 일시',
      cell: ({ row }) => {
        const date = new Date(row.getValue('sessionDate'))
        const time = row.original.sessionTime
        return `${format(date, 'yyyy-MM-dd')} ${time}`
      },
    },
    {
      accessorKey: 'location',
      header: '장소',
      cell: ({ row }) => {
        const location = row.getValue('location') as string
        const additional = row.original.additionalLocation
        return (
          <div>
            <p>{LOCATION_LABELS[location as keyof typeof LOCATION_LABELS]}</p>
            {additional && <p className="text-sm text-muted-foreground">{additional}</p>}
          </div>
        )
      },
    },
    {
      id: 'registration',
      header: '접수기간',
      cell: ({ row }) => {
        const start = new Date(row.original.registrationStart)
        const end = new Date(row.original.registrationEnd)
        return (
          <div className="text-sm">
            <p>{format(start, 'MM/dd')} ~ {format(end, 'MM/dd')}</p>
          </div>
        )
      },
    },
    {
      accessorKey: '_count.applicants',
      header: '신청자',
      cell: ({ row }) => {
        const count = row.original._count.applicants
        return (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{count}명</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => {
        const status = row.getValue('status') as SessionStatus
        const variant = status === 'ACCEPTING' ? 'success' : status === 'CLOSED' ? 'secondary' : 'warning'
        return (
          <Badge variant={variant}>
            {STATUS_LABELS[status]}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const session = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href={`/admin/sessions/${session.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditSession(session)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(session.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={sessions}
        searchKey="round"
        searchPlaceholder="회차로 검색..."
      />
      
      {editSession && (
        <SessionFormDialog
          session={editSession}
          open={!!editSession}
          onOpenChange={(open) => !open && setEditSession(null)}
        />
      )}
      
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        itemName="창업설명회"
      />
    </>
  )
}