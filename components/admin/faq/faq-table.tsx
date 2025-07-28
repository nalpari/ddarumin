'use client'

import * as React from 'react'
import { FAQ, FAQCategory, ContentStatus } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { FAQFormDialog } from './faq-form-dialog'
import { DeleteDialog } from '@/components/admin/DeleteDialog'
import { deleteFAQ, updateFAQ } from '@/lib/actions/faq-actions'
import { useToast } from '@/components/ui/toast'

interface FAQTableProps {
  faqs: FAQ[]
}

const CATEGORY_LABELS = {
  STORE: '매장',
  MENU: '메뉴',
  STARTUP: '창업',
  SMART_ORDER: '스마트오더',
}

export function FAQTable({ faqs }: FAQTableProps) {
  const { showToast } = useToast()
  const [editFAQ, setEditFAQ] = React.useState<FAQ | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteFAQ(deleteId)
    if (result.success) {
      showToast({
        title: 'FAQ가 삭제되었습니다',
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

  const handleToggleStatus = async (faq: FAQ) => {
    const newStatus = faq.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const updateFAQAction = await updateFAQ
    const result = await updateFAQAction({
      id: faq.id,
      status: newStatus,
    })

    if (result.success) {
      showToast({
        title: `FAQ가 ${newStatus === 'ACTIVE' ? '활성화' : '비활성화'}되었습니다`,
        variant: 'success',
      })
    } else {
      showToast({
        title: '상태 변경 실패',
        description: result.error,
        variant: 'destructive',
      })
    }
  }

  const columns: ColumnDef<FAQ>[] = [
    {
      accessorKey: 'category',
      header: '카테고리',
      cell: ({ row }) => {
        const category = row.getValue('category') as FAQCategory
        return (
          <Badge variant="secondary">
            {CATEGORY_LABELS[category]}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'title',
      header: '제목',
      cell: ({ row }) => {
        const title = row.getValue('title') as string
        return <div className="max-w-md truncate">{title}</div>
      },
    },
    {
      accessorKey: 'content',
      header: '내용',
      cell: ({ row }) => {
        const content = row.getValue('content') as string
        return <div className="max-w-md truncate text-muted-foreground">{content}</div>
      },
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => {
        const status = row.getValue('status') as ContentStatus
        return (
          <Badge variant={status === 'ACTIVE' ? 'success' : 'secondary'}>
            {status === 'ACTIVE' ? '활성' : '비활성'}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const faq = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleStatus(faq)}
              title={faq.status === 'ACTIVE' ? '비활성화' : '활성화'}
            >
              {faq.status === 'ACTIVE' ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditFAQ(faq)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(faq.id)}
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
        data={faqs}
        searchKey="title"
        searchPlaceholder="제목으로 검색..."
      />
      
      {editFAQ && (
        <FAQFormDialog
          faq={editFAQ}
          open={!!editFAQ}
          onOpenChange={(open) => !open && setEditFAQ(null)}
        />
      )}
      
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        itemName="FAQ"
      />
    </>
  )
}