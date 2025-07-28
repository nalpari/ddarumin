import { getFAQs } from '@/lib/actions/faq-actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { FAQTable } from '@/components/admin/faq/faq-table'
import { FAQFormDialog } from '@/components/admin/faq/faq-form-dialog'

export default async function FAQsPage() {
  const faqs = await getFAQs()

  return (
    <div>
      <PageHeader
        title="FAQ 관리"
        description="자주 묻는 질문을 관리합니다"
      />
      <FAQFormDialog />
      <FAQTable faqs={faqs} />
    </div>
  )
}