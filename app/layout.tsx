// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

// Using Inter (cleaner & more professional than Geist for education platforms)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-full`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}