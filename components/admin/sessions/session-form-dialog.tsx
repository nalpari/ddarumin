'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { SessionLocation, SessionStatus } from '@prisma/client'
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
import { createStartupSession, updateStartupSession } from '@/lib/actions/session-actions'
import { useToast } from '@/components/ui/toast'
import { Plus, Loader2 } from 'lucide-react'

const sessionFormSchema = z.object({
  round: z.number().int().positive('회차는 양수여야 합니다'),
  sessionDate: z.string().min(1, '설명회 날짜를 입력해주세요'),
  sessionTime: z.string().min(1, '설명회 시간을 입력해주세요'),
  location: z.nativeEnum(SessionLocation),
  additionalLocation: z.string().optional(),
  registrationStart: z.string().min(1, '접수 시작일을 입력해주세요'),
  registrationEnd: z.string().min(1, '접수 종료일을 입력해주세요'),
  status: z.nativeEnum(SessionStatus).optional(),
})

type SessionFormValues = z.infer<typeof sessionFormSchema>

interface SessionFormDialogProps {
  session?: {
    id: string
    round: number
    sessionDate: Date
    sessionTime: string
    location: string
    additionalLocation?: string | null
    registrationStart: Date
    registrationEnd: Date
    status: SessionStatus
  }
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const LOCATION_OPTIONS = [
  { value: 'HEADQUARTERS', label: '본사' },
  { value: 'SEOUL_OFFICE', label: '서울사무소' },
  { value: 'MUGYO_BRANCH', label: '무교점' },
  { value: 'YEOUIDO_BRANCH', label: '여의도점' },
]

const STATUS_OPTIONS = [
  { value: 'WAITING', label: '대기중' },
  { value: 'ACCEPTING', label: '접수중' },
  { value: 'CLOSED', label: '마감' },
]

export function SessionFormDialog({ session, open, onOpenChange }: SessionFormDialogProps) {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionFormSchema),
    defaultValues: session ? {
      round: session.round,
      sessionDate: new Date(session.sessionDate).toISOString().split('T')[0],
      sessionTime: session.sessionTime,
      location: session.location as SessionLocation,
      additionalLocation: session.additionalLocation || '',
      registrationStart: new Date(session.registrationStart).toISOString().split('T')[0],
      registrationEnd: new Date(session.registrationEnd).toISOString().split('T')[0],
      status: session.status,
    } : {
      round: 1,
      sessionDate: '',
      sessionTime: '14:00',
      location: SessionLocation.HEADQUARTERS,
      additionalLocation: '',
      registrationStart: '',
      registrationEnd: '',
      status: SessionStatus.WAITING,
    },
  })

  const handleSubmit = async (values: SessionFormValues) => {
    setIsLoading(true)
    try {
      if (session) {
        const result = await updateStartupSession({
          id: session.id,
          ...values,
        })
        
        if (result.success) {
          showToast({
            title: '창업설명회가 수정되었습니다',
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
        const result = await createStartupSession(values)
        
        if (result.success) {
          showToast({
            title: '창업설명회가 생성되었습니다',
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
      {!session && !open && (
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" />
            창업설명회 추가
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {session ? '창업설명회 수정' : '창업설명회 추가'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="round"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>회차</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={!!session}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sessionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명회 날짜</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sessionTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명회 시간</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>장소</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LOCATION_OPTIONS.map((option) => (
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
              name="additionalLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>상세 주소 (선택)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="예: 3층 대회의실" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="registrationStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>접수 시작일</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>접수 종료일</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {session && (
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
            )}

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
                    {session ? '수정 중...' : '생성 중...'}
                  </>
                ) : (
                  session ? '수정' : '생성'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}