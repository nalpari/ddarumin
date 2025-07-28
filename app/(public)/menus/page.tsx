'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Coffee, Droplets, Cake, Snowflake } from 'lucide-react'
import { Menu, Category } from '@prisma/client'

type MenuWithCategory = Menu & { 
  category: Category
  isPopular?: boolean
  isNew?: boolean
  isAvailable?: boolean
  calories?: number
}

export default function MenusPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [menus, setMenus] = useState<MenuWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menusData, categoriesData] = await Promise.all([
          fetch('/api/public/menus').then(res => res.json()),
          fetch('/api/public/categories').then(res => res.json())
        ])
        setMenus(menusData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to fetch menu data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredMenus = selectedCategory === 'all' 
    ? menus 
    : menus.filter(menu => menu.categoryId === selectedCategory)

  const categoryIcons: Record<string, typeof Coffee> = {
    '커피': Coffee,
    '음료': Droplets,
    '디저트': Cake,
    '시즌메뉴': Snowflake
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">메뉴</h1>
          <p className="text-center text-gray-600 text-lg">
            힘이나는커피생활의 다양한 메뉴를 만나보세요
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white sticky top-16 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-sky-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {categories.map((category) => {
              const Icon = categoryIcons[category.name] || Coffee
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-sky-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
              <p className="mt-4 text-gray-600">메뉴를 불러오는 중...</p>
            </div>
          ) : filteredMenus.length === 0 ? (
            <div className="text-center py-12">
              <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">해당 카테고리에 메뉴가 없습니다.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMenus.map((menu) => (
                <div key={menu.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 relative">
                    {menu.imageUrl ? (
                      <Image
                        src={menu.imageUrl}
                        alt={menu.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Coffee className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {menu.isPopular && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        인기
                      </span>
                    )}
                    {menu.isNew && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        신메뉴
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{menu.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {menu.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sky-700 font-bold text-lg">
                        {menu.price.toLocaleString()}원
                      </p>
                      {menu.calories && (
                        <p className="text-xs text-gray-500">
                          {menu.calories}kcal
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}