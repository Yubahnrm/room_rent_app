import './globals.css'
import { LanguageProvider } from './providers'

export const metadata = {
  title: 'ॐ अतिथि देवो भव: — HNRM Family',
  description: 'नमस्ते 🙏 — Human Nature Reality Movement Family — Yubaraj Timilsina',
  
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        <LanguageProvider>
          <div style={{ background: 'linear-gradient(135deg,#2c1810,#4a2c0a,#1a1a2e)', padding: '1.2rem', textAlign: 'center', borderBottom: '3px solid #c9a84c' }}>
            <div style={{ fontSize: '40px', color: '#c9a84c', marginBottom: '4px' }}>ॐ</div>
            <div style={{ color: '#c9a84c', fontSize: '22px', fontWeight: 'bold', letterSpacing: '3px', marginBottom: '4px' }}>अतिथि देवो भव:</div>
            <div style={{ color: '#e8d5a3', fontSize: '12px', fontStyle: 'italic', marginBottom: '2px' }}>The Guest is God — Treat every soul as divine</div>
            <div style={{ color: '#b8a070', fontSize: '12px', marginBottom: '10px' }}>अतिथिलाई भगवान् सरह सम्मान गर्नुहोस्</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <a href="https://www.yubarajtimilsina.com.np" target="_blank" rel="noopener noreferrer" style={{ color: '#c9a84c', fontSize: '11px', textDecoration: 'none', border: '1px solid #c9a84c', padding: '3px 14px', borderRadius: '20px' }}>🌿 Human Nature Reality Movement (HNRM) Family</a>
              <span style={{ color: '#c9a84c', fontSize: '13px', fontWeight: '700', letterSpacing: '2px' }}>🏠 RentApp — Yubaraj Timilsina</span>
            </div>
          </div>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}