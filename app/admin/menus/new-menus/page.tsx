import { getNewMenus } from '@/lib/actions/new-menu-actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { NewMenuTable } from '@/components/admin/new-menu/new-menu-table'
import { NewMenuFormDialog } from '@/components/admin/new-menu/new-menu-form-dialog'

export default async function NewMenusPage() {
  const newMenus = await getNewMenus()

  return (
    <div>
      <PageHeader
        title="신메뉴 포스터 관리"
        description="신메뉴 출시 포스터를 관리합니다"
      />
      <NewMenuFormDialog />
      <NewMenuTable newMenus={newMenus} />
    </div>
  )
}