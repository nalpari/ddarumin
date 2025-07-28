'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface BatchAction {
  label: string
  onClick: (selectedIds: string[]) => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  icon?: React.ReactNode
}

interface BatchActionBarProps {
  selectedCount: number
  actions: BatchAction[]
  selectedIds: string[]
  onClear: () => void
  className?: string
}

export function BatchActionBar({
  selectedCount,
  actions,
  selectedIds,
  onClear,
  className = '',
}: BatchActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className={`flex items-center justify-between bg-muted p-4 rounded-lg ${className}`}>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">
          {selectedCount}개 선택됨
        </span>
        
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={() => action.onClick(selectedIds)}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
      >
        <X className="h-4 w-4 mr-1" />
        선택 해제
      </Button>
    </div>
  )
}