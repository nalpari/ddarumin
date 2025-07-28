'use client'

import { useState, useCallback } from 'react'
import { useToast } from '@/components/ui/toast'

interface UseCRUDOptions<T> {
  createFn?: (data: Partial<T>) => Promise<{ success: boolean; error?: string; data?: T }>
  updateFn?: (data: Partial<T> & { id: string }) => Promise<{ success: boolean; error?: string; data?: T }>
  deleteFn?: (id: string) => Promise<{ success: boolean; error?: string }>
  onSuccess?: (action: 'create' | 'update' | 'delete', data?: T) => void
  onError?: (action: 'create' | 'update' | 'delete', error: string) => void
}

export function useCRUD<T>({
  createFn,
  updateFn,
  deleteFn,
  onSuccess,
  onError,
}: UseCRUDOptions<T>) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<T | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleCreate = useCallback(async (data: Partial<T>) => {
    if (!createFn) return

    setLoading(true)
    try {
      const result = await createFn(data)
      if (result.success) {
        showToast({
          title: '생성되었습니다',
          variant: 'success',
        })
        onSuccess?.('create', result.data)
        setIsFormOpen(false)
      } else {
        showToast({
          title: '생성 실패',
          description: result.error,
          variant: 'destructive',
        })
        onError?.('create', result.error || '알 수 없는 오류')
      }
    } catch (error) {
      showToast({
        title: '생성 실패',
        description: '오류가 발생했습니다',
        variant: 'destructive',
      })
      onError?.('create', '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }, [createFn, showToast, onSuccess, onError])

  const handleUpdate = useCallback(async (data: Partial<T> & { id: string }) => {
    if (!updateFn) return

    setLoading(true)
    try {
      const result = await updateFn(data)
      if (result.success) {
        showToast({
          title: '수정되었습니다',
          variant: 'success',
        })
        onSuccess?.('update', result.data)
        setEditItem(null)
      } else {
        showToast({
          title: '수정 실패',
          description: result.error,
          variant: 'destructive',
        })
        onError?.('update', result.error || '알 수 없는 오류')
      }
    } catch (error) {
      showToast({
        title: '수정 실패',
        description: '오류가 발생했습니다',
        variant: 'destructive',
      })
      onError?.('update', '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }, [updateFn, showToast, onSuccess, onError])

  const handleDelete = useCallback(async () => {
    if (!deleteFn || !deleteId) return

    setLoading(true)
    try {
      const result = await deleteFn(deleteId)
      if (result.success) {
        showToast({
          title: '삭제되었습니다',
          variant: 'success',
        })
        onSuccess?.('delete')
        setDeleteId(null)
      } else {
        showToast({
          title: '삭제 실패',
          description: result.error,
          variant: 'destructive',
        })
        onError?.('delete', result.error || '알 수 없는 오류')
      }
    } catch (error) {
      showToast({
        title: '삭제 실패',
        description: '오류가 발생했습니다',
        variant: 'destructive',
      })
      onError?.('delete', '오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }, [deleteFn, deleteId, showToast, onSuccess, onError])

  return {
    loading,
    deleteId,
    setDeleteId,
    editItem,
    setEditItem,
    isFormOpen,
    setIsFormOpen,
    handleCreate,
    handleUpdate,
    handleDelete,
  }
}