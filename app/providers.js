'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../lib/language'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('lang')
    if (saved) setLang(saved)
  }, [])

  function toggleLanguage() {
    const newLang = lang === 'en' ? 'np' : 'en'
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  const t = translations[lang]

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}