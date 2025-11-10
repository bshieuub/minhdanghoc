import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Học Tập Cho Minh Đăng 🎓',
  description: 'Ứng dụng học tập thú vị với tự động chấm điểm',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

