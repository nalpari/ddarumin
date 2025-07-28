'use client'

import * as React from 'react'
import { NewMenu, NewMenuStatus } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye } from 'lucide-react'
import { NewMenuFormDialog } from './new-menu-form-dialog'
import { DeleteDialog } from '@/components/admin/DeleteDialog'
import { deleteNewMenu } from '@/lib/actions/new-menu-actions'
import { useToast } from '@/components/ui/toast'
import { format } from '@/lib/utils'
import Image from 'next/image'

interface NewMenuTableProps {
  newMenus: NewMenu[]
}

const STATUS_LABELS = {
  WAITING: '대기중',
  ACTIVE: '활성',
  EXPIRED: '종료',
}

const STATUS_VARIANTS = {
  WAITING: 'warning',
  ACTIVE: 'success',
  EXPIRED: 'secondary',
} as const

export function NewMenuTable({ newMenus }: NewMenuTableProps) {
  const { showToast } = useToast()
  const [editMenu, setEditMenu] = React.useState<NewMenu | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [previewImage, setPreviewImage] = React.useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteNewMenu(deleteId)
    if (result.success) {
      showToast({
        title: '신메뉴 포스터가 삭제되었습니다',
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

  const columns: ColumnDef<NewMenu>[] = [
    {
      accessorKey: 'imageUrl',
      header: '포스터',
      cell: ({ row }) => {
        const imageUrl = row.getValue('imageUrl') as string
        return (
          <button
            onClick={() => setPreviewImage(imageUrl)}
            className="relative w-16 h-16 rounded overflow-hidden hover:opacity-80 transition-opacity"
          >
            <Image
              src={imageUrl}
              alt={row.original.title}
              fill
              className="object-cover"
            />
          </button>
        )
      },
    },
    {
      accessorKey: 'title',
      header: '제목',
    },
    {
      id: 'period',
      header: '기간',
      cell: ({ row }) => {
        const startDate = new Date(row.original.startDate)
        const endDate = new Date(row.original.endDate)
        return (
          <div className="text-sm">
            <p>{format(startDate, 'yyyy-MM-dd')}</p>
            <p className="text-muted-foreground">~ {format(endDate, 'yyyy-MM-dd')}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: '상태',
      cell: ({ row }) => {
        const status = row.getValue('status') as NewMenuStatus
        return (
          <Badge variant={STATUS_VARIANTS[status]}>
            {STATUS_LABELS[status]}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: '생성일',
      cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'yyyy-MM-dd'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const menu = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewImage(menu.imageUrl)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditMenu(menu)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(menu.id)}
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
        data={newMenus}
        searchKey="title"
        searchPlaceholder="제목으로 검색..."
      />
      
      {editMenu && (
        <NewMenuFormDialog
          newMenu={editMenu}
          open={!!editMenu}
          onOpenChange={(open) => !open && setEditMenu(null)}
        />
      )}
      
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        itemName="신메뉴 포스터"
      />
      
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setPreviewImage(null)}
            >
              <span className="sr-only">닫기</span>
              ×
            </Button>
          </div>
        </div>
      )}
    </>
  )
}