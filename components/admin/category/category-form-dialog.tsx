'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ContentStatus } from '@prisma/client'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCategory, updateCategory } from '@/lib/actions/category-actions'
import { useToast } from '@/components/ui/toast'
import { Plus, Loader2 } from 'lucide-react'

const categoryFormSchema = z.object({
  name: z.string().min(1, '카테고리명을 입력해주세요').max(50),
  status: z.nativeEnum(ContentStatus),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface CategoryFormDialogProps {
  category?: {
    id: string
    name: string
    status: ContentStatus
  }
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: '활성' },
  { value: 'INACTIVE', label: '비활성' },
]

export function CategoryFormDialog({ category, open, onOpenChange }: CategoryFormDialogProps) {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: category ? {
      name: category.name,
      status: category.status,
    } : {
      name: '',
      status: ContentStatus.ACTIVE,
    },
  })

  const handleSubmit = async (values: CategoryFormValues) => {
    setIsLoading(true)
    try {
      if (category) {
        const result = await updateCategory({
          id: category.id,
          ...values,
        })
        
        if (result.success) {
          showToast({
            title: '카테고리가 수정되었습니다',
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
        const result = await createCategory(values)
        
        if (result.success) {
          showToast({
            title: '카테고리가 생성되었습니다',
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
    } catch {
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
      {!category && !open && (
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" />
            카테고리 추가
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? '카테고리 수정' : '카테고리 추가'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리명</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="예: 커피, 음료, 디저트" />
                  </FormControl>
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
                    {category ? '수정 중...' : '생성 중...'}
                  </>
                ) : (
                  category ? '수정' : '생성'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}