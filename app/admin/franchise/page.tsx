import { getFranchiseInquiries } from '@/lib/actions/franchise-actions'
import { PageHeader } from '@/components/admin/PageHeader'
import { FranchiseInquiryTable } from '@/components/admin/franchise/inquiry-table'

export default async function FranchiseInquiriesPage() {
  const inquiries = await getFranchiseInquiries()

  return (
    <div>
      <PageHeader
        title="가맹문의 관리"
        description="가맹점 문의 내역을 확인하고 답변을 관리합니다"
      />
      <FranchiseInquiryTable inquiries={inquiries} />
    </div>
  )
}