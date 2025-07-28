'use client'

import * as React from 'react'
import { ContentStatus } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { CategoryFormDialog } from './category-form-dialog'
import { DeleteDialog } from '@/components/admin/DeleteDialog'
import { deleteCategory, updateCategory } from '@/lib/actions/category-actions'
import { useToast } from '@/components/ui/toast'
import { format } from '@/lib/utils'

interface CategoryWithCount {
  id: string
  name: string
  status: ContentStatus
  createdAt: Date
  updatedAt: Date
  _count: {
    menus: number
  }
}

interface CategoryTableProps {
  categories: CategoryWithCount[]
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const { showToast } = useToast()
  const [editCategory, setEditCategory] = React.useState<CategoryWithCount | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteCategory(deleteId)
    if (result.success) {
      showToast({
        title: '카테고리가 삭제되었습니다',
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

  const handleToggleStatus = async (category: CategoryWithCount) => {
    const newStatus = category.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const updateCategoryAction = await updateCategory
    const result = await updateCategoryAction({
      id: category.id,
      status: newStatus,
    })

    if (result.success) {
      showToast({
        title: `카테고리가 ${newStatus === 'ACTIVE' ? '활성화' : '비활성화'}되었습니다`,
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

  const columns: ColumnDef<CategoryWithCount>[] = [
    {
      accessorKey: 'name',
      header: '카테고리명',
    },
    {
      accessorKey: '_count.menus',
      header: '메뉴 수',
      cell: ({ row }) => {
        const count = row.original._count.menus
        return <span>{count}개</span>
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
      accessorKey: 'createdAt',
      header: '생성일',
      cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'yyyy-MM-dd'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const category = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleStatus(category)}
              title={category.status === 'ACTIVE' ? '비활성화' : '활성화'}
            >
              {category.status === 'ACTIVE' ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditCategory(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteId(category.id)}
              disabled={category._count.menus > 0}
              title={category._count.menus > 0 ? '메뉴가 있는 카테고리는 삭제할 수 없습니다' : ''}
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
        data={categories}
        searchKey="name"
        searchPlaceholder="카테고리명으로 검색..."
      />
      
      {editCategory && (
        <CategoryFormDialog
          category={editCategory}
          open={!!editCategory}
          onOpenChange={(open) => !open && setEditCategory(null)}
        />
      )}
      
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        itemName="카테고리"
      />
    </>
  )
}