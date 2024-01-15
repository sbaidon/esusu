import type { Metadata } from 'next'
import type { ReactElement } from 'react'
import { Rubik } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'

interface Props {
  children: ReactElement
}

const mainFont = Rubik({
  subsets: ['latin'],
  display: 'fallback',
  weight: 'variable',
  variable: '--font-family'
})

export const metadata: Metadata = {
  title: 'Four Connect - Esusu'
}

export default function RootLayout({ children }: Props) {
  return (
    <html className={cn(mainFont.variable)} lang="en" suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element  -- Outdated rule */}
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="/images/favicon.ico" rel="icon" />
      </head>
      <body>{children}</body>
    </html>
  )
}
