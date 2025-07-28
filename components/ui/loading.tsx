import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin text-sky-600',
        sizeClasses[size],
        className
      )} 
    />
  )
}

interface LoadingPageProps {
  text?: string
}

export function LoadingPage({ text = '로딩 중...' }: LoadingPageProps) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  )
}

interface LoadingOverlayProps {
  visible: boolean
  text?: string
}

export function LoadingOverlay({ visible, text = '처리 중...' }: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <LoadingSpinner size="lg" className="mx-auto mb-3" />
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  )
}

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
    />
  )
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full">
      <div className="border rounded-lg">
        <div className="border-b bg-gray-50 p-4">
          <Skeleton className="h-6 w-32" />
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b p-4">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className="h-4 flex-1"
                  style={{ width: `${Math.random() * 30 + 70}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}