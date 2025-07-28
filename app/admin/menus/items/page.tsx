import { getMenus } from '@/lib/actions/menu-actions'
import { getCategories } from '@/lib/actions/category-actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { MenuTable } from '@/components/admin/menu/menu-table'
import { MenuFormDialog } from '@/components/admin/menu/menu-form-dialog'

export default async function MenuItemsPage() {
  const [menus, categories] = await Promise.all([
    getMenus(),
    getCategories(),
  ])

  return (
    <div>
      <PageHeader
        title="메뉴 관리"
        description="메뉴 아이템을 관리합니다"
      />
      <MenuFormDialog categories={categories} />
      <MenuTable menus={menus} categories={categories} />
    </div>
  )
}