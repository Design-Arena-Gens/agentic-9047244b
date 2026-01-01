import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Social Media Automation',
  description: 'AI-powered social media content creation and posting automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
