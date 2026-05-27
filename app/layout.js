import './globals.css'
import { LanguageProvider } from './providers'
import { headers } from 'next/headers'

export const metadata = {
  title: 'ॐ अतिथि देवो भव: — HNRM Family',
  description: 'नमस्ते — Human Nature Reality Movement Family',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}