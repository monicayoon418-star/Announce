import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import Navigation from '@/components/ui/Navigation'
import Toast from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: '어나운스 | 생일카페·팝업스토어 지도',
  description: '서울의 생일카페, 전시회, 팝업스토어를 지도로 탐색하세요',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-white relative">
            <main className="flex-1 pb-16">{children}</main>
            <Navigation />
          </div>
          <Toast />
        </Providers>
      </body>
    </html>
  )
}
