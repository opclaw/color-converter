import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://color-converter.vercel.app'),
  title: 'Color Converter — HEX to RGB, HSL, CMYK | Free Online Tool',
  description: 'Convert colors between HEX, RGB, HSL, and CMYK formats. Professional color converter with live preview and CSS code generation.',
  keywords: ['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'cmyk converter', 'color picker'],
  authors: [{ name: 'SmartOK Tools' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://color-converter.vercel.app',
    siteName: 'Color Converter',
    title: 'Color Converter — HEX to RGB, HSL, CMYK',
    description: 'Convert colors between HEX, RGB, HSL, and CMYK formats.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Converter',
    description: 'Convert colors between HEX, RGB, HSL, and CMYK formats.',
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
              featureList: 'HEX to RGB conversion, RGB to HSL conversion, CMYK support, Color preview, CSS code generation',
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  )
}
