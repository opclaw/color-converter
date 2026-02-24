'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './page.module.css'

interface ColorState {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
}

export default function Home() {
  const [color, setColor] = useState<ColorState>({
    hex: '#667eea',
    rgb: { r: 102, g: 126, b: 234 },
    hsl: { h: 231, s: 76, l: 66 },
  })
  const [copied, setCopied] = useState('')

  // HEX to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // RGB to HEX
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, x)).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  // RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  // HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100
    let r, g, b
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
  }

  const handleHexChange = (hex: string) => {
    if (!/^#[0-9A-F]{6}$/i.test(hex)) return
    const rgb = hexToRgb(hex)
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      setColor({ hex: hex.toLowerCase(), rgb, hsl })
    }
  }

  const handleRgbChange = (key: keyof ColorState['rgb'], value: number) => {
    const newRgb = { ...color.rgb, [key]: Math.max(0, Math.min(255, value)) }
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b)
    setColor({ hex, rgb: newRgb, hsl })
  }

  const handleHslChange = (key: keyof ColorState['hsl'], value: number) => {
    const newHsl = { ...color.hsl, [key]: key === 'h' ? Math.max(0, Math.min(360, value)) : Math.max(0, Math.min(100, value)) }
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    setColor({ hex, rgb, hsl: newHsl })
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const getRgbString = () => `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
  const getHslString = () => `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`

  const getContrastColor = (r: number, g: number, b: number) => {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#000000' : '#ffffff'
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>🎨 Color Converter</div>
        </div>
      </header>

      <section className={styles.hero}>
        <h1>
          Convert
          <span className={styles.gradient}> Colors</span>
        </h1>
        <p className={styles.subtitle}>
          Convert between HEX, RGB, HSL, and more. Live preview with one-click copy.
        </p>
      </section>

      <section className={styles.tool}>
        <div className={styles.toolContainer}>
          {/* Color Preview */}
          <div 
            className={styles.preview}
            style={{ 
              backgroundColor: color.hex,
              color: getContrastColor(color.rgb.r, color.rgb.g, color.rgb.b)
            }}
          >
            <span>{color.hex.toUpperCase()}</span>
          </div>

          {/* HEX Input */}
          <div className={styles.inputGroup}>
            <label>HEX</label>
            <div className={styles.inputRow}>
              <input
                type="text"
                value={color.hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className={styles.hexInput}
                maxLength={7}
              />
              <input
                type="color"
                value={color.hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className={styles.colorPicker}
              />
              <button 
                onClick={() => copyToClipboard(color.hex, 'HEX')}
                className={styles.copyBtn}
              >
                {copied === 'HEX' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          {/* RGB Inputs */}
          <div className={styles.inputGroup}>
            <label>RGB</label>
            <div className={styles.rgbRow}>
              <div className={styles.rgbInput}
                <span>R</span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={color.rgb.r}
                  onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className={styles.rgbInput}
                <span>G</span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={color.rgb.g}
                  onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className={styles.rgbInput}
                <span>B</span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={color.rgb.b}
                  onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                />
              </div>
              <button 
                onClick={() => copyToClipboard(getRgbString(), 'RGB')}
                className={styles.copyBtn}
              >
                {copied === 'RGB' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          {/* HSL Inputs */}
          <div className={styles.inputGroup}>
            <label>HSL</label>
            <div className={styles.rgbRow}
              <div className={styles.rgbInput}
                <span>H</span>
                <input
                  type="number"
                  min={0}
                  max={360}
                  value={color.hsl.h}
                  onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className={styles.rgbInput}
                <span>S%</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={color.hsl.s}
                  onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className={styles.rgbInput}
                <span>L%</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={color.hsl.l}
                  onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                />
              </div>
              <button 
                onClick={() => copyToClipboard(getHslString(), 'HSL')}
                className={styles.copyBtn}
              >
                {copied === 'HSL' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          {/* CSS Output */}
          <div className={styles.cssOutput}>
            <h3>CSS Code</h3>
            <code>
              color: {color.hex};{","/*\n              */} background-color: {getRgbString()};{","/*\n              */} border-color: {getHslString()};
            </code>
            <button 
              onClick={() => copyToClipboard(`color: ${color.hex};\nbackground-color: ${getRgbString()};\nborder-color: ${getHslString()};`, 'CSS')}
              className={styles.copyCssBtn}
            >
              {copied === 'CSS' ? '✓ Copied!' : '📋 Copy CSS'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}