"use client"

import { useState } from 'react'

export default function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState('en')
  const locales = ['en', 'es', 'fr', 'de', 'zh', 'ja']
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    setCurrentLocale(newLocale)
    console.log('Language selected:', newLocale)
    // In a real app, you would update the locale and reload the page
    // or use a proper i18n library
  }
  
  return (
    <div className="container mx-auto p-2">
      <select
        name="locale"
        value={currentLocale}
        onChange={handleLanguageChange}
        className="px-3 py-1 border rounded"
      >
        {locales.map(locale => (
          <option key={locale} value={locale}>
            {locale.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
} 