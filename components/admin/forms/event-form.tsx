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
import { uploadFile } from '@/lib/supabase/storage'
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config'
import { useToast } from '@/components/ui/toast'
import { Loader2, Calendar } from 'lucide-react'

const eventFormSchema = z.object({
  title: z.string().min(1, '이벤트 제목을 입력해주세요').max(200),
  description: z.string().min(1, '이벤트 설명을 입력해주세요'),
  imageUrl: z.string().min(1, '이벤트 이미지를 업로드해주세요'),
  startDate: z.string().min(1, '시작일을 입력해주세요'),
  endDate: z.string().min(1, '종료일을 입력해주세요'),
  eventType: z.enum(['PROMOTION', 'NEW_MENU', 'NOTICE']),
  targetStores: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
})
.refine((data) => {
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return end >= start
}, {
  message: '종료일은 시작일 이후여야 합니다',
  path: ['endDate'],
})

type EventFormValues = z.infer<typeof eventFormSchema>

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>
  stores?: Array<{ id: string; name: string }>
  onSubmit: (values: EventFormValues) => Promise<void>
  isLoading?: boolean
}

const EVENT_TYPES = [
  { value: 'PROMOTION', label: '프로모션' },
  { value: 'NEW_MENU', label: '신메뉴 출시' },
  { value: 'NOTICE', label: '공지사항' },
]

export function EventForm({ defaultValues, stores = [], onSubmit, isLoading }: EventFormProps) {
  const { showToast } = useToast()
  const [isUploading, setIsUploading] = React.useState(false)

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      eventType: 'PROMOTION',
      targetStores: [],
      isActive: true,
      ...defaultValues,
    },
  })

  const handleImageUpload = async (file: File): Promise<string> => {
    setIsUploading(true)
    try {
      const result = await uploadFile({
        bucket: STORAGE_BUCKETS.EVENTS,
        file,
        path: `events/${new Date().getFullYear()}`,
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

  const handleSubmit = async (values: EventFormValues) => {
    try {
      await onSubmit(values)
      showToast({
        title: '이벤트 저장 완료',
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이벤트 제목 *</FormLabel>
              <FormControl>
                <Input placeholder="여름 시즌 특별 할인 이벤트" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이벤트 유형 *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="이벤트 유형 선택" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이벤트 설명 *</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="이벤트 내용을 자세히 설명해주세요" 
                  {...field} 
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <FormLabel>이벤트 배너 이미지 *</FormLabel>
              <FormControl>
                <SingleFileUpload
                  value={field.value}
                  onChange={field.onChange}
                  onUpload={handleImageUpload}
                  disabled={isUploading || isLoading}
                  placeholder="이벤트 배너 이미지를 업로드하세요"
                />
              </FormControl>
              <FormDescription>
                권장 크기: 1920x600px, 최대 5MB
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {stores.length > 0 && (
          <FormField
            control={form.control}
            name="targetStores"
            render={({ field }) => (
              <FormItem>
                <FormLabel>적용 매장</FormLabel>
                <FormDescription>
                  선택하지 않으면 모든 매장에 적용됩니다
                </FormDescription>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {stores.map((store) => (
                    <label
                      key={store.id}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={store.id}
                        checked={field.value?.includes(store.id)}
                        onChange={(e) => {
                          const value = e.target.value
                          const current = field.value || []
                          if (e.target.checked) {
                            field.onChange([...current, value])
                          } else {
                            field.onChange(current.filter(id => id !== value))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{store.name}</span>
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
            '이벤트 저장'
          )}
        </Button>
      </form>
    </Form>
  )
}