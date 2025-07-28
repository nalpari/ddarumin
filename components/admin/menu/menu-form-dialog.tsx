'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ContentStatus, MarketingTag, Temperature } from '@prisma/client'
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
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { SingleFileUpload } from '@/components/ui/single-file-upload'
import { createMenu, updateMenu } from '@/lib/actions/menu-actions'
import { uploadFile } from '@/lib/supabase/storage'
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config'
import { useToast } from '@/components/ui/toast'
import { Plus, Loader2 } from 'lucide-react'

const menuFormSchema = z.object({
  categoryId: z.string().min(1, '카테고리를 선택해주세요'),
  name: z.string().min(1, '메뉴명을 입력해주세요').max(100),
  price: z.string().transform((val) => parseInt(val, 10)).or(z.number()),
  discountPrice: z.string().transform((val) => val ? parseInt(val, 10) : null).optional().nullable(),
  marketingTags: z.array(z.nativeEnum(MarketingTag)).default([]),
  hotColdOptions: z.array(z.nativeEnum(Temperature)).default([]),
  description: z.string().min(1, '설명을 입력해주세요'),
  imageUrl: z.string().optional().nullable(),
  status: z.nativeEnum(ContentStatus),
}).refine((data) => {
  if (data.discountPrice && data.discountPrice >= data.price) {
    return false
  }
  return true
}, {
  message: '할인가격은 정가보다 낮아야 합니다',
  path: ['discountPrice'],
})

type MenuFormValues = z.infer<typeof menuFormSchema>

interface MenuFormDialogProps {
  menu?: {
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
  }
  categories: Array<{ id: string; name: string; status: ContentStatus }>
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const MARKETING_TAG_OPTIONS = [
  { value: MarketingTag.NEW, label: '신메뉴' },
  { value: MarketingTag.BEST, label: '베스트' },
  { value: MarketingTag.EVENT, label: '이벤트' },
]

const TEMPERATURE_OPTIONS = [
  { value: Temperature.HOT, label: 'Hot' },
  { value: Temperature.COLD, label: 'Ice' },
]

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: '활성' },
  { value: 'INACTIVE', label: '비활성' },
]

export function MenuFormDialog({ menu, categories, open, onOpenChange }: MenuFormDialogProps) {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const activeCategories = categories.filter(cat => cat.status === 'ACTIVE')

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: menu ? {
      categoryId: menu.categoryId,
      name: menu.name,
      price: menu.price,
      discountPrice: menu.discountPrice,
      marketingTags: menu.marketingTags,
      hotColdOptions: menu.hotColdOptions,
      description: menu.description,
      imageUrl: menu.imageUrl,
      status: menu.status,
    } : {
      categoryId: '',
      name: '',
      price: 0,
      discountPrice: null,
      marketingTags: [],
      hotColdOptions: [],
      description: '',
      imageUrl: null,
      status: ContentStatus.ACTIVE,
    },
  })

  const handleImageUpload = async (file: File): Promise<string> => {
    setIsUploading(true)
    try {
      const result = await uploadFile({
        bucket: STORAGE_BUCKETS.MENUS,
        file,
        path: `menu-items/${new Date().getFullYear()}`,
      })

      if (result.success && result.url) {
        showToast({
          title: '이미지 업로드 완료',
          variant: 'success',
        })
        return result.url
      } else {
        throw new Error(result.error || '업로드 실패')
      }
    } catch (error) {
      showToast({
        title: '이미지 업로드 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (values: MenuFormValues) => {
    setIsLoading(true)
    try {
      const processedValues = {
        ...values,
        price: typeof values.price === 'string' ? parseInt(values.price, 10) : values.price,
        discountPrice: values.discountPrice ? 
          (typeof values.discountPrice === 'string' ? parseInt(values.discountPrice, 10) : values.discountPrice) : 
          null,
      }

      if (menu) {
        const result = await updateMenu({
          id: menu.id,
          ...processedValues,
        })
        
        if (result.success) {
          showToast({
            title: '메뉴가 수정되었습니다',
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
        const result = await createMenu(processedValues)
        
        if (result.success) {
          showToast({
            title: '메뉴가 생성되었습니다',
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
      {!menu && !open && (
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" />
            메뉴 추가
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {menu ? '메뉴 수정' : '메뉴 추가'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리 *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>메뉴명 *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="아메리카노" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>정가 *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        placeholder="4500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>할인가</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        placeholder="3900"
                      />
                    </FormControl>
                    <FormDescription>
                      할인가격이 있을 경우에만 입력
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명 *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="브라질산 원두를 사용한 진한 에스프레소"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingTags"
              render={() => (
                <FormItem>
                  <FormLabel>마케팅 태그</FormLabel>
                  <div className="flex gap-4">
                    {MARKETING_TAG_OPTIONS.map((tag) => (
                      <FormField
                        key={tag.value}
                        control={form.control}
                        name="marketingTags"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(tag.value)}
                                onCheckedChange={(checked) => {
                                  const updated = checked
                                    ? [...(field.value || []), tag.value]
                                    : field.value?.filter((value) => value !== tag.value) || []
                                  field.onChange(updated)
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {tag.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hotColdOptions"
              render={() => (
                <FormItem>
                  <FormLabel>온도 옵션</FormLabel>
                  <div className="flex gap-4">
                    {TEMPERATURE_OPTIONS.map((temp) => (
                      <FormField
                        key={temp.value}
                        control={form.control}
                        name="hotColdOptions"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(temp.value)}
                                onCheckedChange={(checked) => {
                                  const updated = checked
                                    ? [...(field.value || []), temp.value]
                                    : field.value?.filter((value) => value !== temp.value) || []
                                  field.onChange(updated)
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {temp.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>메뉴 이미지</FormLabel>
                  <FormControl>
                    <SingleFileUpload
                      value={field.value || ''}
                      onChange={field.onChange}
                      onUpload={handleImageUpload}
                      disabled={isUploading || isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    권장 크기: 800x800px, 최대 5MB
                  </FormDescription>
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
              <Button type="submit" disabled={isLoading || isUploading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {menu ? '수정 중...' : '생성 중...'}
                  </>
                ) : (
                  menu ? '수정' : '생성'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}