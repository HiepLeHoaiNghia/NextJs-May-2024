import '~/app/globals.css'

import type { Metadata } from 'next'
import { Sansita } from 'next/font/google'
import localFont from 'next/font/local'

import ButtonRedirect from '~/app/components/ButtonRedirect'

const sansita = Sansita({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'Learning Next js',
  description: 'Learning Next js with Tailwind CSS and TypeScript'
}

const sansitaLocal = localFont({
  src: [
    { path: 'fonts/Sansita/Sansita-Regular.ttf', weight: '400' },
    { path: 'fonts/Sansita/Sansita-Bold.ttf', weight: '700' }
  ],
  display: 'swap',
  variable: '--font-sansita'
})

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={sansitaLocal.variable}>
        <header>Root Layout</header>
        <ButtonRedirect />
        {children}
      </body>
    </html>
  )
}
