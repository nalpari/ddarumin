'use client'

import * as React from 'react'
import { SessionApplicant } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/DataTable'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { format } from '@/lib/utils'
import { DeleteDialog } from '@/components/admin/DeleteDialog'
import { deleteSessionApplicant } from '@/lib/actions/session-actions'
import { useToast } from '@/components/ui/toast'

interface ApplicantTableProps {
  applicants: SessionApplicant[]
}

export function ApplicantTable({ applicants }: ApplicantTableProps) {
  const { showToast } = useToast()
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteSessionApplicant(deleteId)
    if (result.success) {
      showToast({
        title: '신청자가 삭제되었습니다',
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

  const columns: ColumnDef<SessionApplicant>[] = [
    {
      accessorKey: 'createdAt',
      header: '신청일시',
      cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'yyyy-MM-dd HH:mm'),
    },
    {
      accessorKey: 'name',
      header: '이름',
    },
    {
      accessorKey: 'ageGroup',
      header: '연령대',
    },
    {
      accessorKey: 'phone',
      header: '연락처',
    },
    {
      accessorKey: 'email',
      header: '이메일',
    },
    {
      accessorKey: 'storeOwnership',
      header: '점포보유',
      cell: ({ row }) => {
        const ownership = row.getValue('storeOwnership') as string
        return ownership === 'OWN' ? '보유' : '미보유'
      },
    },
    {
      accessorKey: 'attendeeCount',
      header: '참석인원',
      cell: ({ row }) => `${row.getValue('attendeeCount')}명`,
    },
    {
      accessorKey: 'desiredRegion',
      header: '희망지역',
    },
    {
      accessorKey: 'availableTime',
      header: '상담가능시간',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const applicant = row.original

        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(applicant.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={applicants}
        searchKey="name"
        searchPlaceholder="이름으로 검색..."
      />
      
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        itemName="신청자"
      />
    </>
  )
}