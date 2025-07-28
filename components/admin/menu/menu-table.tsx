'use client'

import * as React from 'react'
import { ContentStatus, MarketingTag, Temperature } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/admin/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { MenuFormDialog } from './menu-form-dialog'
import { DeleteDialog } from '@/components/admin/DeleteDialog'
import { deleteMenu, updateMenu } from '@/lib/actions/menu-actions'
import { useToast } from '@/components/ui/toast'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'

interface MenuWithCategory {
  id: string
  categoryId: string
  name: string
  price: number
  discountPrice: number | null
  marketingTags: MarketingTag[]
  hotColdOptions: Temperature[]
  description: string
  imageUrl: string | null
  status: ContentStatus
  createdAt: Date
  category: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
  status: ContentStatus
}

interface MenuTableProps {
  menus: MenuWithCategory[]
  categories: Category[]
}

const TAG_LABELS = {
  NEW: '신메뉴',
  BEST: '베스트',
  EVENT: '이벤트',
}

const TEMP_LABELS = {
  HOT: 'Hot',
  COLD: 'Ice',
}

export function MenuTable({ menus, categories }: MenuTableProps) {
  const { showToast } = useToast()
  const [editMenu, setEditMenu] = React.useState<MenuWithCategory | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return

    const result = await deleteMenu(deleteId)
    if (result.success) {
      showToast({
        title: '메뉴가 삭제되었습니다',
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

  const handleToggleStatus = async (menu: MenuWithCategory) => {
    const newStatus = menu.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const updateMenuAction = await updateMenu
    const result = await updateMenuAction({
      id: menu.id,
      status: newStatus,
    })

    if (result.success) {
      showToast({
        title: `메뉴가 ${newStatus === 'ACTIVE' ? '활성화' : '비활성화'}되었습니다`,
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

  const columns: ColumnDef<MenuWithCategory>[] = [
    {
      accessorKey: 'imageUrl',
      header: '이미지',
      cell: ({ row }) => {
        const imageUrl = row.getValue('imageUrl') as string | null
        return imageUrl ? (
          <div className="relative w-12 h-12 rounded overflow-hidden">
            <Image
              src={imageUrl}
              alt={row.original.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded" />
        )
      },
    },
    {
      accessorKey: 'category.name',
      header: '카테고리',
      cell: ({ row }) => {
        return <Badge variant="outline">{row.original.category.name}</Badge>
      },
    },
    {
      accessorKey: 'name',
      header: '메뉴명',
    },
    {
      accessorKey: 'price',
      header: '가격',
      cell: ({ row }) => {
        const price = row.getValue('price') as number
        const discountPrice = row.original.discountPrice
        return (
          <div>
            {discountPrice ? (
              <>
                <span className="line-through text-muted-foreground">
                  {formatPrice(price)}
                </span>
                <span className="ml-2 font-medium text-red-600">
                  {formatPrice(discountPrice)}
                </span>
              </>
            ) : (
              <span>{formatPrice(price)}</span>
            )}
          </div>
        )
      },
    },
    {
      id: 'tags',
      header: '태그/옵션',
      cell: ({ row }) => {
        const tags = row.original.marketingTags
        const temps = row.original.hotColdOptions
        return (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {TAG_LABELS[tag]}
              </Badge>
            ))}
            {temps.map((temp) => (
              <Badge key={temp} variant="outline" className="text-xs">
                {TEMP_LABELS[temp]}
              </Badge>
            ))}
          </div>
        )
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
        const menu = row.original

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleStatus(menu)}
              title={menu.status === 'ACTIVE' ? '비활성화' : '활성화'}
            >
              {menu.status === 'ACTIVE' ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
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
        data={menus}
        searchKey="name"
        searchPlaceholder="메뉴명으로 검색..."
      />
      
      {editMenu && (
        <MenuFormDialog
          menu={editMenu}
          categories={categories}
          open={!!editMenu}
          onOpenChange={(open) => !open && setEditMenu(null)}
        />
      )}
      
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        itemName="메뉴"
      />
    </>
  )
}