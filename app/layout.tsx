import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ABU Huawei Test Prep Platform',
    description: 'Platform for preparing for Huawei competition tests at Ahmadu Bello University.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/abu-logo-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/abu-logo-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/abu-logo.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/abu-apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
