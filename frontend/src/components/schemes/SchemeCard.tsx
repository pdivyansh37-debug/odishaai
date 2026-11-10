import React from 'react'
import { ExternalLink, CheckCircle2, FileText, ChevronRight } from 'lucide-react'

interface SchemeCardProps {
  scheme: {
    id: number | string
    name_odia: string
    name_en?: string
    name_english?: string
    dept?: string
    department?: string
    benefits?: string | string[]
    documents_required?: string[]
    match_score?: number
  }
  compact?: boolean
  onApply?: () => void
}

export default function SchemeCard({ scheme, compact, onApply }: SchemeCardProps) {
  const nameEn = scheme.name_en || scheme.name_english || ''
  const dept = scheme.dept || scheme.department || 'Government of Odisha'
  const benefitsText = Array.isArray(scheme.benefits)
    ? scheme.benefits.join(', ')
    : scheme.benefits || 'Financial assistance and welfare benefits.'

  if (compact) {
    return (
      <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-sm text-slate-800 leading-snug">
                {scheme.name_odia}
              </h4>
              <div className="text-xs text-slate-500 font-medium">{nameEn}</div>
            </div>
            {scheme.match_score !== undefined && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                {Math.round(scheme.match_score)}% Match
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {benefitsText}
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 truncate max-w-[180px]">{dept}</span>
          <a
            href="https://odisha.gov.in"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-0.5"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              {dept}
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {scheme.name_odia}
            </h3>
            <p className="text-xs text-slate-500 font-medium">{nameEn}</p>
          </div>
          {scheme.match_score !== undefined && (
            <div className="text-center bg-emerald-50 border border-emerald-200 rounded-xl px-2.5 py-1.5 flex-shrink-0">
              <span className="block text-base font-extrabold text-emerald-700">
                {Math.round(scheme.match_score)}%
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase">
                Eligible
              </span>
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mt-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Benefits / ସୁବିଧା</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {benefitsText}
          </p>
        </div>

        {/* Documents */}
        {scheme.documents_required && scheme.documents_required.length > 0 && (
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Documents Needed / ଆବଶ୍ୟକ କାଗଜପତ୍ର</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1 pl-1">
              {scheme.documents_required.slice(0, 3).map((doc, i) => (
                <li key={i} className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>{doc}</span>
                </li>
              ))}
              {scheme.documents_required.length > 3 && (
                <li className="text-[11px] text-slate-400 italic">
                  +{scheme.documents_required.length - 3} more documents
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <a
          href="https://odisha.gov.in"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <button
          onClick={onApply}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
        >
          Apply Online / ଆବେଦନ
        </button>
      </div>
    </div>
  )
}

