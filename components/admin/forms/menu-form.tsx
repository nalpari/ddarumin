'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
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
import { SingleFileUpload } from '@/components/ui/single-file-upload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { uploadFile } from '@/lib/supabase/storage'
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config'
import { useToast } from '@/components/ui/toast'
import { Loader2 } from 'lucide-react'

const menuFormSchema = z.object({
  name: z.string().min(1, '메뉴명을 입력해주세요').max(100),
  categoryId: z.string().min(1, '카테고리를 선택해주세요'),
  description: z.string().max(500).optional(),
  price: z.number().min(0, '가격은 0원 이상이어야 합니다'),
  imageUrl: z.string().optional(),
  isPopular: z.boolean().default(false),
  isNew: z.boolean().default(false),
  allergyInfo: z.string().optional(),
  nutritionInfo: z.object({
    calories: z.number().optional(),
    protein: z.number().optional(),
    fat: z.number().optional(),
    carbs: z.number().optional(),
  }).optional(),
})

type MenuFormValues = z.infer<typeof menuFormSchema>

interface MenuFormProps {
  defaultValues?: Partial<MenuFormValues>
  categories: Array<{ id: string; name: string }>
  onSubmit: (values: MenuFormValues) => Promise<void>
  isLoading?: boolean
}

export function MenuForm({ defaultValues, categories, onSubmit, isLoading }: MenuFormProps) {
  const { showToast } = useToast()
  const [isUploading, setIsUploading] = React.useState(false)

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      description: '',
      price: 0,
      imageUrl: '',
      isPopular: false,
      isNew: false,
      allergyInfo: '',
      ...defaultValues,
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
    try {
      await onSubmit(values)
      showToast({
        title: '메뉴 저장 완료',
        variant: 'success',
      })
    } catch (error) {
      showToast({
        title: '저장 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>메뉴명 *</FormLabel>
                <FormControl>
                  <Input placeholder="아메리카노" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="메뉴에 대한 설명을 입력하세요" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>가격 *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="4500" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>원 단위로 입력하세요</FormDescription>
              <FormMessage />
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
                  value={field.value}
                  onChange={field.onChange}
                  onUpload={handleImageUpload}
                  disabled={isUploading || isLoading}
                />
              </FormControl>
              <FormDescription>
                권장 크기: 800x600px, 최대 5MB
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isPopular"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>인기 메뉴</FormLabel>
                  <FormDescription>
                    인기 메뉴로 표시됩니다
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isNew"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>신메뉴</FormLabel>
                  <FormDescription>
                    신메뉴 배지가 표시됩니다
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="allergyInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>알레르기 정보</FormLabel>
              <FormControl>
                <Input 
                  placeholder="우유, 대두 포함" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                포함된 알레르기 유발 성분을 입력하세요
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isLoading || isUploading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              저장 중...
            </>
          ) : (
            '메뉴 저장'
          )}
        </Button>
      </form>
    </Form>
  )
}