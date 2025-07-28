import { getCategories } from '@/lib/actions/category-actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { CategoryTable } from '@/components/admin/category/category-table'
import { CategoryFormDialog } from '@/components/admin/category/category-form-dialog'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <PageHeader
        title="메뉴 카테고리 관리"
        description="메뉴 카테고리를 관리합니다"
      />
      <CategoryFormDialog />
      <CategoryTable categories={categories} />
    </div>
  )
}