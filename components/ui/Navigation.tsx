'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: '지도', icon: '🗺️' },
  { href: '/explore', label: '탐색', icon: '🔍' },
  { href: '/wishlist', label: '찜', icon: '🤍' },
]

export default function Navigation() {
  const pathname = usePathname()
  if (pathname.startsWith('/operator')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-gray-200 z-40">
      <div className="flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs ${
                isActive ? 'text-pink-500' : 'text-gray-400'
              }`}
            >
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
