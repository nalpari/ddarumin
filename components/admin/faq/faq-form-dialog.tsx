'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FAQCategory, ContentStatus, FAQ } from '@prisma/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createFAQ, updateFAQ } from '@/lib/actions/faq-actions'
import { useToast } from '@/components/ui/toast'
import { Plus, Loader2 } from 'lucide-react'

const faqFormSchema = z.object({
  category: z.nativeEnum(FAQCategory),
  title: z.string().min(1, '제목을 입력해주세요').max(200),
  content: z.string().min(1, '내용을 입력해주세요'),
  status: z.nativeEnum(ContentStatus),
})

type FAQFormValues = z.infer<typeof faqFormSchema>

interface FAQFormDialogProps {
  faq?: FAQ
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const CATEGORY_OPTIONS = [
  { value: 'STORE', label: '매장' },
  { value: 'MENU', label: '메뉴' },
  { value: 'STARTUP', label: '창업' },
  { value: 'SMART_ORDER', label: '스마트오더' },
]

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: '활성' },
  { value: 'INACTIVE', label: '비활성' },
]

export function FAQFormDialog({ faq, open, onOpenChange }: FAQFormDialogProps) {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const form = useForm<FAQFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: faq ? {
      category: faq.category,
      title: faq.title,
      content: faq.content,
      status: faq.status,
    } : {
      category: FAQCategory.STORE,
      title: '',
      content: '',
      status: ContentStatus.ACTIVE,
    },
  })

  const handleSubmit = async (values: FAQFormValues) => {
    setIsLoading(true)
    try {
      if (faq) {
        const result = await updateFAQ({
          id: faq.id,
          ...values,
        })
        
        if (result.success) {
          showToast({
            title: 'FAQ가 수정되었습니다',
            variant: 'success',
          })
          if (onOpenChange) onOpenChange(false)
          else setIsOpen(false)
        } else {
          showToast({
            title: '수정 실패',
            description: result.error,
            variant: 'destructive',
          })
        }
      } else {
        const result = await createFAQ(values)
        
        if (result.success) {
          showToast({
            title: 'FAQ가 생성되었습니다',
            variant: 'success',
          })
          form.reset()
          if (onOpenChange) onOpenChange(false)
          else setIsOpen(false)
        } else {
          showToast({
            title: '생성 실패',
            description: result.error,
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      showToast({
        title: '오류 발생',
        description: '작업 중 오류가 발생했습니다',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const dialogOpen = open !== undefined ? open : isOpen
  const setDialogOpen = onOpenChange || setIsOpen

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!faq && !open && (
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" />
            FAQ 추가
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {faq ? 'FAQ 수정' : 'FAQ 추가'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상태</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>질문</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="자주 묻는 질문을 입력하세요" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>답변</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="답변 내용을 입력하세요" 
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {faq ? '수정 중...' : '생성 중...'}
                  </>
                ) : (
                  faq ? '수정' : '생성'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}