'use client'

import { Category, CATEGORY_LABELS } from '@/types'
import { useStore } from '@/store/useStore'

const categories: (Category | null)[] = [null, 'birthday', 'exhibition', 'popup']

const activeColors: Record<string, string> = {
  birthday: 'border-pink-400 bg-pink-50 text-pink-600',
  exhibition: 'border-purple-400 bg-purple-50 text-purple-600',
  popup: 'border-orange-400 bg-orange-50 text-orange-600',
}

export default function CategoryFilter() {
  const { selectedCategory, setSelectedCategory } = useStore()

  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat
        return (
          <button
            key={cat ?? 'all'}
            onClick={() => setSelectedCategory(cat)}
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
  )
}
