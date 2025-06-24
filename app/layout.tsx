import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Feature Freeze Game',
  description: 'Created with v0 by Kyald',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
