'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { NewMenu } from '@prisma/client'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SingleFileUpload } from '@/components/ui/single-file-upload'
import { createNewMenu, updateNewMenu } from '@/lib/actions/new-menu-actions'
import { uploadFile } from '@/lib/supabase/storage'
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config'
import { useToast } from '@/components/ui/toast'
import { Plus, Loader2, Calendar } from 'lucide-react'

const newMenuFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(200),
  startDate: z.string().min(1, '시작일을 입력해주세요'),
  endDate: z.string().min(1, '종료일을 입력해주세요'),
  imageUrl: z.string().min(1, '포스터 이미지를 업로드해주세요'),
}).refine((data) => {
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return end >= start
}, {
  message: '종료일은 시작일 이후여야 합니다',
  path: ['endDate'],
})

type NewMenuFormValues = z.infer<typeof newMenuFormSchema>

interface NewMenuFormDialogProps {
  newMenu?: NewMenu
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function NewMenuFormDialog({ newMenu, open, onOpenChange }: NewMenuFormDialogProps) {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const form = useForm<NewMenuFormValues>({
    resolver: zodResolver(newMenuFormSchema),
    defaultValues: newMenu ? {
      title: newMenu.title,
      startDate: new Date(newMenu.startDate).toISOString().split('T')[0],
      endDate: new Date(newMenu.endDate).toISOString().split('T')[0],
      imageUrl: newMenu.imageUrl,
    } : {
      title: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days later
      imageUrl: '',
    },
  })

  const handleImageUpload = async (file: File): Promise<string> => {
    setIsUploading(true)
    try {
      const result = await uploadFile({
        bucket: STORAGE_BUCKETS.MENUS,
        file,
        path: `new-menu-posters/${new Date().getFullYear()}`,
      })

      if (result.success && result.url) {
        showToast({
          title: '포스터 업로드 완료',
          variant: 'success',
        })
        return result.url
      } else {
        throw new Error(result.error || '업로드 실패')
      }
    } catch (error) {
      showToast({
        title: '포스터 업로드 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (values: NewMenuFormValues) => {
    setIsLoading(true)
    try {
      if (newMenu) {
        const result = await updateNewMenu({
          id: newMenu.id,
          ...values,
        })
        
        if (result.success) {
          showToast({
            title: '신메뉴 포스터가 수정되었습니다',
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
        const result = await createNewMenu(values)
        
        if (result.success) {
          showToast({
            title: '신메뉴 포스터가 생성되었습니다',
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
      {!newMenu && !open && (
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" />
            신메뉴 포스터 추가
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {newMenu ? '신메뉴 포스터 수정' : '신메뉴 포스터 추가'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목 *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="2024년 여름 신메뉴 출시" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>시작일 *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="date" 
                          {...field} 
                          className="pl-10"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>종료일 *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="date" 
                          {...field}
                          className="pl-10"
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>포스터 이미지 *</FormLabel>
                  <FormControl>
                    <SingleFileUpload
                      value={field.value}
                      onChange={field.onChange}
                      onUpload={handleImageUpload}
                      disabled={isUploading || isLoading}
                      placeholder="신메뉴 포스터를 업로드하세요"
                    />
                  </FormControl>
                  <FormDescription>
                    권장 크기: 1200x800px, 최대 5MB
                  </FormDescription>
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
              <Button type="submit" disabled={isLoading || isUploading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {newMenu ? '수정 중...' : '생성 중...'}
                  </>
                ) : (
                  newMenu ? '수정' : '생성'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}