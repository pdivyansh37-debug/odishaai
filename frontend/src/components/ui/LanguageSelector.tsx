import { Language, LanguageOption } from '../../types'
import clsx from 'clsx'

interface LanguageSelectorProps {
  value: Language
  onChange: (lang: Language) => void
  className?: string
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ', flag: '🏔️' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🌐' },
]

export default function LanguageSelector({ value, onChange, className }: LanguageSelectorProps) {
  const current = LANGUAGES.find((l) => l.code === value)

  return (
    <div className={clsx('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
        className="appearance-none bg-white border-2 border-gray-200 rounded-xl px-4 py-2 pr-8 font-medium text-gray-700 focus:outline-none focus:border-primary cursor-pointer text-sm"
        aria-label="Select language"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.nativeLabel}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
