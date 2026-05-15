import './globals.css'
import { LanguageProvider } from './providers'

export const metadata = {
  title: 'Rental Management App',
  description: 'HNRM Property Management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        <LanguageProvider>

          {/* Spiritual Header */}
          <div style={{
            background: 'linear-gradient(135deg, #2c1810, #4a2c0a, #1a1a2e)',
            padding: '1.5rem',
            textAlign: 'center',
            borderBottom: '3px solid #c9a84c',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04, fontSize: '60px', lineHeight: '1.2', pointerEvents: 'none', userSelect: 'none', wordBreak: 'break-all' }}>
              ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ ॐ
            </div>
            <div style={{ fontSize: '44px', lineHeight: 1, marginBottom: '0.4rem', filter: 'drop-shadow(0 0 12px rgba(201,168,76,0.8))' }}>ॐ</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '0.6rem' }}>
              <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, transparent, #c9a84c)' }}></div>
              <span style={{ color: '#c9a84c', fontSize: '14px' }}>✦ ✦ ✦</span>
              <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, transparent, #c9a84c)' }}></div>
            </div>
            <div style={{ color: '#c9a84c', fontSize: '24px', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '0.3rem', textShadow: '0 0 20px rgba(201,168,76,0.5)' }}>
              अतिथि देवो भव
            </div>
            <div style={{ color: '#e8d5a3', fontSize: '13px', letterSpacing: '2px', marginBottom: '0.2rem', fontStyle: 'italic' }}>
              " The Guest is God — Treat every soul as divine "
            </div>
            <div style={{ color: '#b8a070', fontSize: '13px', letterSpacing: '1px', marginBottom: '0.8rem' }}>
              अतिथिलाई भगवान् सरह सम्मान गर्नुहोस्
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to right, transparent, #c9a84c)' }}></div>
              <span style={{ color: '#c9a84c', fontSize: '12px' }}>🪔 ❀ 🪔</span>
              <div style={{ height: '1px', width: '80px', background: 'linear-gradient(to left, transparent, #c9a84c)' }}></div>
            </div>
          </div>

          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}