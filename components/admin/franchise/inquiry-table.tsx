'use client'

import * as React from 'react'
import { FranchiseInquiry, InquiryStatus } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Trash2 } from 'lucide-react'
import { format } from '@/lib/utils'
import { InquiryDetailDialog } from './inquiry-detail-dialog'
import { DeleteDialog } from '@/components/admin/DeleteDialog'
import { deleteFranchiseInquiry } from '@/lib/actions/franchise-actions'
import { useToast } from '@/components/ui/toast'

interface FranchiseInquiryTableProps {
  inquiries: FranchiseInquiry[]
}

export function FranchiseInquiryTable({ inquiries }: FranchiseInquiryTableProps) {
  const { showToast } = useToast()
  const [selectedInquiry, setSelectedInquiry] = React.useState<FranchiseInquiry | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteFranchiseInquiry(deleteId)
    if (result.success) {
      showToast({
        title: '가맹문의가 삭제되었습니다',
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

  const columns: ColumnDef<FranchiseInquiry>[] = [
    {
      accessorKey: 'createdAt',
      header: '문의일시',
      cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'yyyy-MM-dd HH:mm'),
    },
    {
      accessorKey: 'name',
      header: '이름',
    },
    {
      accessorKey: 'phone',
      header: '연락처',
    },
    {
      accessorKey: 'region',
      header: '희망지역',
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
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => {
        const status = row.getValue('status') as InquiryStatus
        return (
          <Badge variant={status === 'COMPLETED' ? 'success' : 'warning'}>
            {status === 'COMPLETED' ? '답변완료' : '대기중'}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const inquiry = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedInquiry(inquiry)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(inquiry.id)}
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
        data={inquiries}
        searchKey="name"
        searchPlaceholder="이름으로 검색..."
      />
      
      {selectedInquiry && (
        <InquiryDetailDialog
          inquiry={selectedInquiry}
          open={!!selectedInquiry}
          onOpenChange={(open) => !open && setSelectedInquiry(null)}
        />
      )}
      
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        itemName="가맹문의"
      />
    </>
  )
}