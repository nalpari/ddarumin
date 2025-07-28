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
import { FileUpload } from '@/components/ui/file-upload'
import { ImageGallery } from '@/components/ui/image-gallery'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useImageList } from '@/hooks/use-image-list'
import { STORAGE_BUCKETS } from '@/lib/supabase/storage-config'
import { useToast } from '@/components/ui/toast'
import { Loader2 } from 'lucide-react'

const storeFormSchema = z.object({
  name: z.string().min(1, '매장명을 입력해주세요').max(100),
  address: z.string().min(1, '주소를 입력해주세요'),
  phone: z.string().min(1, '전화번호를 입력해주세요'),
  businessHours: z.object({
    weekday: z.string(),
    weekend: z.string(),
    holiday: z.string().optional(),
  }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  region: z.string().min(1, '지역을 선택해주세요'),
  images: z.array(z.string()).optional(),
  isOpen: z.boolean().default(true),
})

type StoreFormValues = z.infer<typeof storeFormSchema>

interface StoreFormProps {
  defaultValues?: Partial<StoreFormValues>
  onSubmit: (values: StoreFormValues) => Promise<void>
  isLoading?: boolean
}

const REGIONS = [
  { value: 'seoul', label: '서울특별시' },
  { value: 'gyeonggi', label: '경기도' },
  { value: 'incheon', label: '인천광역시' },
  { value: 'busan', label: '부산광역시' },
  { value: 'daegu', label: '대구광역시' },
  { value: 'gwangju', label: '광주광역시' },
  { value: 'daejeon', label: '대전광역시' },
  { value: 'ulsan', label: '울산광역시' },
  // Add more regions as needed
]

export function StoreForm({ defaultValues, onSubmit, isLoading }: StoreFormProps) {
  const { showToast } = useToast()
  
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      businessHours: {
        weekday: '09:00 - 22:00',
        weekend: '10:00 - 22:00',
        holiday: '휴무',
      },
      latitude: 37.5665,
      longitude: 126.9780,
      region: '',
      images: [],
      isOpen: true,
      ...defaultValues,
    },
  })

  const {
    images,
    isUploading,
    addImage,
    removeImage,
    setImages,
  } = useImageList({
    bucket: STORAGE_BUCKETS.STORES,
    path: `stores/${new Date().getFullYear()}`,
    maxImages: 5,
    initialImages: defaultValues?.images?.map((url, index) => ({
      id: `existing-${index}`,
      url,
      name: `Image ${index + 1}`,
    })) || [],
  })

  const handleFilesUpload = async (files: File[]) => {
    for (const file of files) {
      const newImage = await addImage(file)
      if (!newImage) {
        showToast({
          title: '업로드 실패',
          description: `${file.name} 업로드 중 오류가 발생했습니다`,
          variant: 'destructive',
        })
      }
    }
    
    // Update form value with new image URLs
    form.setValue('images', images.map(img => img.url))
  }

  const handleImageRemove = async (id: string) => {
    await removeImage(id)
    // Update form value
    form.setValue('images', images.filter(img => img.id !== id).map(img => img.url))
  }

  const handleSubmit = async (values: StoreFormValues) => {
    try {
      // Include current images in submission
      const submitData = {
        ...values,
        images: images.map(img => img.url),
      }
      await onSubmit(submitData)
      showToast({
        title: '매장 정보 저장 완료',
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
                <FormLabel>매장명 *</FormLabel>
                <FormControl>
                  <Input placeholder="힘이나는커피생활 강남점" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>지역 *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="지역 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>주소 *</FormLabel>
              <FormControl>
                <Input placeholder="서울특별시 강남구 테헤란로 123" {...field} />
              </FormControl>
              <FormDescription>
                우편번호 검색 기능은 추후 추가 예정입니다
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>전화번호 *</FormLabel>
              <FormControl>
                <Input placeholder="02-1234-5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">영업시간</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="businessHours.weekday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>평일</FormLabel>
                  <FormControl>
                    <Input placeholder="09:00 - 22:00" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessHours.weekend"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>주말</FormLabel>
                  <FormControl>
                    <Input placeholder="10:00 - 22:00" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessHours.holiday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>공휴일</FormLabel>
                  <FormControl>
                    <Input placeholder="휴무" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">매장 이미지</h3>
          <FormDescription>
            최대 5개의 이미지를 업로드할 수 있습니다
          </FormDescription>
          
          <FileUpload
            value={[]}
            onUpload={handleFilesUpload}
            multiple
            maxFiles={5 - images.length}
            disabled={isLoading || isUploading || images.length >= 5}
            showPreview={false}
          />

          {images.length > 0 && (
            <ImageGallery
              images={images}
              onRemove={handleImageRemove}
              columns={3}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>위도</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.000001"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  지도 API 연동 후 자동 입력됩니다
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>경도</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.000001"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  지도 API 연동 후 자동 입력됩니다
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

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
            '매장 정보 저장'
          )}
        </Button>
      </form>
    </Form>
  )
}