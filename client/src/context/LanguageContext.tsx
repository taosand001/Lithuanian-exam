import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react'

export type Lang = 'lt' | 'en' | 'es' | 'fr' | 'tr' | 'de'

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'lt', label: 'Lietuvių', flag: '🇱🇹' },
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'es', label: 'Español',  flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'tr', label: 'Türkçe',   flag: '🇹🇷' },
  { code: 'de', label: 'Deutsch',  flag: '🇩🇪' },
]

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  translateText: (text: string, targetLang?: Lang) => Promise<string>
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('lt')
  const cache = useRef<Map<string, Map<string, string>>>(new Map())

  const setLang = (l: Lang) => {
    setLangState(l)
  }

  const translateText = async (text: string, targetLang?: Lang): Promise<string> => {
    const tl = targetLang ?? lang
    if (tl === 'lt' || !text.trim()) return text
    const langCache = cache.current.get(tl) ?? new Map<string, string>()
    if (langCache.has(text)) return langCache.get(text)!
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=lt&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const translated: string = data[0]?.map((chunk: [string]) => chunk[0]).join('') ?? text
      langCache.set(text, translated)
      cache.current.set(tl, langCache)
      return translated
    } catch (err) {
      console.warn('[Translation] API failed:', err)
      return text
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, translateText }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}

/** Hook to translate a flat record of strings when language changes */
export function useTranslations<T extends Record<string, string>>(source: T): T {
  const { lang, translateText } = useLang()
  const [translated, setTranslated] = useState<T>(source)

  useEffect(() => {
    if (lang === 'lt') {
      setTranslated(source)
      return
    }
    let cancelled = false
    const keys = Object.keys(source) as (keyof T)[]
    Promise.all(keys.map(k => translateText(source[k] as string, lang))).then(results => {
      if (cancelled) return
      const out = {} as T
      keys.forEach((k, i) => { out[k] = results[i] as T[keyof T] })
      setTranslated(out)
    })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  return translated
}
