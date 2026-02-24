'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [hex, setHex] = useState('#667eea')

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgb = hexToRgb(hex)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Color Converter</h1>
      <div className={styles.preview} style={{ backgroundColor: hex }}></div>
      <div className={styles.inputGroup}>
        <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} className={styles.textInput} />
        <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className={styles.colorInput} />
      </div>
      <div className={styles.result}>
        <p className={styles.resultText}>RGB: {rgb.r}, {rgb.g}, {rgb.b}</p>
        <p className={styles.resultText}>HEX: {hex}</p>
      </div>
    </div>
  )
}