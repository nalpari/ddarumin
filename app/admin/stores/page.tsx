'use client'

import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StoreTable } from '@/components/admin/stores/store-table'
import { StoreFormDialog } from '@/components/admin/stores/store-form-dialog'
import { StoreDetailDialog } from '@/components/admin/stores/store-detail-dialog'
import { StoreRegion, OperatingStatus, Store } from '@prisma/client'
import { useToast } from '@/hooks/use-toast'

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<StoreRegion | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<OperatingStatus | 'all'>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [viewingStore, setViewingStore] = useState<Store | null>(null)
  const { toast } = useToast()

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/admin/stores')
      if (!response.ok) throw new Error('Failed to fetch stores')
      const data = await response.json()
      setStores(data)
    } catch {
      toast({
        title: '오류',
        description: '매장 목록을 불러오는데 실패했습니다.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.phone.includes(searchTerm)
    const matchesRegion = selectedRegion === 'all' || store.region === selectedRegion
    const matchesStatus = selectedStatus === 'all' || store.operatingStatus === selectedStatus
    
    return matchesSearch && matchesRegion && matchesStatus
  })

  const handleAdd = () => {
    setEditingStore(null)
    setIsFormOpen(true)
  }

  const handleEdit = (store: Store) => {
    setEditingStore(store)
    setIsFormOpen(true)
  }

  const handleView = (store: Store) => {
    setViewingStore(store)
    setIsDetailOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/stores/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete store')

      toast({
        title: '성공',
        description: '매장이 삭제되었습니다.'
      })
      
      await fetchStores()
    } catch {
      toast({
        title: '오류',
        description: '매장 삭제에 실패했습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleSave = async () => {
    await fetchStores()
    setIsFormOpen(false)
    setEditingStore(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">매장 관리</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          매장 추가
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="매장명, 주소, 전화번호로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value as StoreRegion | 'all')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">전체 지역</option>
            <option value="SEOUL">서울</option>
            <option value="GYEONGGI">경기</option>
            <option value="BUSAN">부산</option>
            <option value="DAEGU">대구</option>
            <option value="INCHEON">인천</option>
            <option value="GWANGJU">광주</option>
            <option value="DAEJEON">대전</option>
            <option value="ULSAN">울산</option>
            <option value="OTHER">기타</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OperatingStatus | 'all')}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">전체 상태</option>
            <option value="OPEN">영업중</option>
            <option value="CLOSED">영업종료</option>
            <option value="PREPARING">준비중</option>
            <option value="VACATION">휴가중</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          <StoreTable
            stores={filteredStores}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </div>

      {/* Form Dialog */}
      <StoreFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        store={editingStore}
        onSuccess={handleSave}
      />

      {/* Detail Dialog */}
      <StoreDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        store={viewingStore}
      />
    </div>
  )
}