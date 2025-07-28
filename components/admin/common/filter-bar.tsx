'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  key: string
  label: string
  type: 'text' | 'select' | 'date'
  options?: FilterOption[]
  placeholder?: string
}

interface FilterBarProps {
  filters: FilterConfig[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  onReset?: () => void
  onSearch?: () => void
  className?: string
}

export function FilterBar({
  filters,
  values,
  onChange,
  onReset,
  onSearch,
  className = '',
}: FilterBarProps) {
  const hasActiveFilters = Object.values(values).some(value => value !== '')

  return (
    <div className={`flex flex-wrap gap-4 items-end ${className}`}>
      {filters.map((filter) => (
        <div key={filter.key} className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-1 block">
            {filter.label}
          </label>
          
          {filter.type === 'text' && (
            <Input
              type="text"
              placeholder={filter.placeholder || `${filter.label} 입력...`}
              value={values[filter.key] || ''}
              onChange={(e) => onChange(filter.key, e.target.value)}
              className="w-full"
            />
          )}
          
          {filter.type === 'select' && filter.options && (
            <Select
              value={values[filter.key] || ''}
              onValueChange={(value) => onChange(filter.key, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder || '선택...'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {filter.type === 'date' && (
            <Input
              type="date"
              value={values[filter.key] || ''}
              onChange={(e) => onChange(filter.key, e.target.value)}
              className="w-full"
            />
          )}
        </div>
      ))}
      
      <div className="flex gap-2">
        {onSearch && (
          <Button onClick={onSearch} variant="default">
            <Search className="h-4 w-4 mr-2" />
            검색
          </Button>
        )}
        
        {onReset && hasActiveFilters && (
          <Button onClick={onReset} variant="outline">
            <X className="h-4 w-4 mr-2" />
            초기화
          </Button>
        )}
      </div>
    </div>
  )
}