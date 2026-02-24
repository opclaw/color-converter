import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://colorconverter.vercel.app'),
  title: 'Color Converter — HEX, RGB, HSL & More',
  description: 'Convert colors between HEX, RGB, HSL, CMYK, and HSV formats. Free online color converter with live preview and copy functionality.',
  keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'color picker', 'hex color'],
  authors: [{ name: 'Color Converter' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://colorconverter.vercel.app',
    siteName: 'Color Converter',
    title: 'Color Converter — HEX, RGB, HSL & More',
    description: 'Convert colors between HEX, RGB, HSL, CMYK, and HSV formats.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Converter',
    description: 'Convert colors between HEX, RGB, HSL, CMYK, and HSV formats.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Color Converter',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              featureList: 'HEX to RGB, RGB to HSL, CMYK conversion, Color picker, Live preview',
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}