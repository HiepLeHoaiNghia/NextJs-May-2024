import type React from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      Auth Layout
      <br />
      <Link className='font-black text-green-950' href='/'>
        Home page
      </Link>
      <br />
      {children}
    </div>
  )
}
