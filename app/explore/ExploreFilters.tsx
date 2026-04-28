'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Category, CATEGORY_LABELS } from '@/types'

const categories: (Category | null)[] = [null, 'birthday', 'exhibition', 'popup']

interface Props {
  initialSearch: string
  initialCategory: string
}

export default function ExploreFilters({ initialSearch, initialCategory }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(initialSearch)

  const pushParams = (newSearch: string, newCategory: string) => {
    const params = new URLSearchParams()
    if (newSearch) params.set('search', newSearch)
    if (newCategory) params.set('category', newCategory)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    pushParams(search, initialCategory)
  }

  const handleCategory = (cat: Category | null) => {
    pushParams(initialSearch, cat ?? '')
  }

  const activeColors: Record<string, string> = {
    birthday: 'border-pink-400 bg-pink-50 text-pink-600',
    exhibition: 'border-purple-400 bg-purple-50 text-purple-600',
    popup: 'border-orange-400 bg-orange-50 text-orange-600',
  }

  return (
    <div className={`transition-opacity ${isPending ? 'opacity-60' : ''}`}>
      <form onSubmit={handleSearch} className="flex gap-2 px-4 mb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이벤트명, 아티스트 검색..."
          className="flex-1 px-4 py-2.5 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button type="submit" className="px-4 py-2.5 bg-pink-500 text-white rounded-2xl text-sm font-medium">
          검색
        </button>
      </form>

      <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
        {categories.map((cat) => {
          const isActive = (cat ?? '') === initialCategory
          return (
            <button
              key={cat ?? 'all'}
              onClick={() => handleCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                isActive
                  ? cat
                    ? activeColors[cat]
                    : 'border-gray-800 bg-gray-800 text-white'
                  : 'border-gray-200 bg-white text-gray-500'
              }`}
            >
              {cat ? CATEGORY_LABELS[cat] : '전체'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
