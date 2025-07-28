'use client'

import * as React from 'react'
import { FranchiseInquiry, InquiryStatus } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { format } from '@/lib/utils'
import { updateFranchiseInquiry } from '@/lib/actions/franchise-actions'
import { useToast } from '@/components/ui/toast'
import { Loader2 } from 'lucide-react'

interface InquiryDetailDialogProps {
  inquiry: FranchiseInquiry
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InquiryDetailDialog({ inquiry, open, onOpenChange }: InquiryDetailDialogProps) {
  const { showToast } = useToast()
  const [response, setResponse] = React.useState(inquiry.response || '')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const result = await updateFranchiseInquiry({
        id: inquiry.id,
        status: response ? 'COMPLETED' : 'PENDING',
        response: response || undefined,
      })

      if (result.success) {
        showToast({
          title: '답변이 저장되었습니다',
          variant: 'success',
        })
        onOpenChange(false)
      } else {
        showToast({
          title: '저장 실패',
          description: result.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      showToast({
        title: '오류 발생',
        description: '답변 저장 중 오류가 발생했습니다',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>가맹문의 상세</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">문의일시</p>
              <p className="text-sm">{format(new Date(inquiry.createdAt), 'yyyy년 MM월 dd일 HH:mm')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">상태</p>
              <Badge variant={inquiry.status === 'COMPLETED' ? 'success' : 'warning'}>
                {inquiry.status === 'COMPLETED' ? '답변완료' : '대기중'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">이름</p>
              <p className="text-sm">{inquiry.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">연령대</p>
              <p className="text-sm">{inquiry.ageGroup}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">연락처</p>
              <p className="text-sm">{inquiry.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">이메일</p>
              <p className="text-sm">{inquiry.email || '-'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">점포보유</p>
              <p className="text-sm">{inquiry.storeOwnership === 'OWN' ? '보유' : '미보유'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">희망지역</p>
              <p className="text-sm">{inquiry.region}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">브랜드 인지경로</p>
            <p className="text-sm">{inquiry.brandAwareness.join(', ')}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">통화 가능 시간</p>
            <p className="text-sm">{inquiry.availableTime}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">문의내용</p>
            <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{inquiry.content}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">답변</p>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="답변을 입력하세요..."
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                '답변 저장'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}