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
  title: {
    template: '%s • CBT Platform',
    default: 'CBT Platform',
  },
  description: 'A modern, secure, and intuitive Computer-Based Testing platform for schools and institutions.',
  keywords: [
    'CBT',
    'computer based test',
    'online exam',
    'education',
    'assessment',
    'e-learning',
    'student portal',
  ],
  authors: [{ name: 'Your Team' }],
  creator: 'Your Team',
  publisher: 'Your Team',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yourdomain.com'), // Change to your real domain later
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'CBT Platform',
    title: 'CBT Platform',
    description: 'Secure online examinations made simple.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CBT Platform',
    description: 'Secure online examinations made simple.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-light-32x32.png', media: '(prefers-color-dark)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-light)' },
    ],
    apple: '/apple-touch-icon.png',
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