'use client'

import { useState, useCallback } from 'react'

interface ColorValues {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  cmyk: { c: number; m: number; y: number; k: number }
}

export default function Home() {
  const [color, setColor] = useState('#6366f1')
  const [copied, setCopied] = useState<string | null>(null)

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255)
    let m = 1 - (g / 255)
    let y = 1 - (b / 255)
    let k = Math.min(c, m, y)
    
    c = (c - k) / (1 - k) || 0
    m = (m - k) / (1 - k) || 0
    y = (y - k) / (1 - k) || 0
    
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    }
  }

  const rgb = hexToRgb(color)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }, [])

  const formats = [
    { label: 'HEX', value: color.toUpperCase(), css: `color: ${color};` },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, css: `color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b});` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, css: `color: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%);` },
    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, css: `color: cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%);` },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl shadow-lg">🎨</div>
              <div>
                <span className="text-xl font-bold text-slate-900">Color Converter</span>
                <p className="text-sm text-slate-500">HEX, RGB, HSL, CMYK</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#tool" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Tool</a>
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">FAQ</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-3xl shadow-xl mb-6">🎨</div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Color Converter</h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">Convert between HEX, RGB, HSL, and CMYK color formats instantly. Perfect for designers and developers.</p>
          </div>
        </div>
      </section>

      {/* Tool */}
      <main id="tool" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 md:p-8">
          {/* Color Preview */}
          <div className="mb-8">
            <div 
              className="w-full h-32 rounded-xl shadow-inner mb-4 transition-colors duration-300"
              style={{ backgroundColor: color }}
            />
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">HEX Color</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 input uppercase"
                    placeholder="#6366f1"
                    maxLength={7}
                  />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-11 rounded-lg border border-slate-300 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Color Values */}
          <div className="grid sm:grid-cols-2 gap-4">
            {formats.map((format) => (
              <div key={format.label} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{format.label}</span>
                  <button
                    onClick={() => copyToClipboard(format.value, format.label)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {copied === format.label ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="font-mono text-sm text-slate-900 bg-white rounded-lg px-3 py-2 border border-slate-200">
                  {format.value}
                </div>
              </div>
            ))}
          </div>

          {/* CSS Code */}
          <div className="mt-6 bg-slate-900 rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CSS Code</span>
              <button
                onClick={() => copyToClipboard(`color: ${color};`, 'css')}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {copied === 'css' ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <code className="text-sm text-emerald-400 font-mono">color: {color};</code>
          </div>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="bg-white border-t border-slate-200 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Use Our Color Converter?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Professional color tools for designers and developers.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎨', title: 'Live Preview', description: 'See your color instantly with a large preview area that updates in real-time.' },
              { icon: '🔄', title: 'Multiple Formats', description: 'Convert between HEX, RGB, HSL, and CMYK with a single click.' },
              { icon: '📋', title: 'One-Click Copy', description: 'Copy any color format instantly to your clipboard.' },
              { icon: '⚡', title: 'Instant Results', description: 'No server processing. All conversions happen in your browser.' },
              { icon: '🎯', title: 'Color Picker', description: 'Built-in color picker for easy color selection.' },
              { icon: '💻', title: 'CSS Ready', description: 'Get CSS code ready to paste into your stylesheets.' },
            ].map((f, i) => (
              <div key={i} className="group p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-pink-200 hover:shadow-lg hover:shadow-pink-100/50 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-slate-50 border-t border-slate-200 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'What color formats are supported?', a: 'We support HEX, RGB, HSL, and CMYK color formats. You can convert between any of these formats instantly.' },
              { q: 'Is this tool free to use?', a: 'Yes, completely free. No registration, no limits, no watermarks.' },
              { q: 'How accurate are the conversions?', a: 'Our conversions are mathematically precise. However, CMYK is designed for print and may vary based on your printer and paper.' },
              { q: 'Can I use this for web design?', a: 'Absolutely! The tool provides CSS-ready color codes that you can copy directly into your stylesheets.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-lg">🎨</div>
              <span className="text-white font-semibold">Color Converter</span>
            </div>
            <p className="text-sm">© 2024 SmartOK Tools. Free online tools for everyone.</p>
            <div className="flex gap-6">
              <a href="/privacy" className="text-sm hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="text-sm hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
