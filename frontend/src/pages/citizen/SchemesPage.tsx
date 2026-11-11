import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Sparkles,
  AlertCircle,
  X,
  CheckCircle2,
  ExternalLink,
  Phone,
  MessageSquare,
  MapPin,
  FileCheck2,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import SchemeCard from '../../components/schemes/SchemeCard'
import { getSchemes, checkEligibility } from '../../api/schemes'
import { ODISHA_SCHEMES } from '../../data/odishaData'
import toast from 'react-hot-toast'

const SAMPLE_PROFILES = [
  {
    label: '🌾 Small Farmer (KALIA / BSKY)',
    data: { age: 38, income: 60000, caste: 'OBC', land_holding: 1.5, occupation: 'farmer', district: 'Khordha', gender: 'male', is_bpl: true },
  },
  {
    label: '👩 Woman / Mother (Mamata / Mission Shakti)',
    data: { age: 26, income: 55000, caste: 'SC', land_holding: 0, occupation: 'self_employed', district: 'Cuttack', gender: 'female', is_bpl: true },
  },
  {
    label: '👴 Senior Citizen (Madhu Babu Pension)',
    data: { age: 66, income: 18000, caste: 'General', land_holding: 0, occupation: 'laborer', district: 'Puri', gender: 'male', is_bpl: true },
  },
  {
    label: '🎓 Student (Adarsha Vidyalaya)',
    data: { age: 13, income: 75000, caste: 'ST', land_holding: 1.0, occupation: 'student', district: 'Mayurbhanj', gender: 'female', is_bpl: true },
  },
]

export default function SchemesPage() {
  const navigate = useNavigate()
  const [allSchemes, setAllSchemes] = useState<any[]>(ODISHA_SCHEMES)
  const [matchedSchemes, setMatchedSchemes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [step, setStep] = useState(1)

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState('All')

  // Scheme Detail Modal state
  const [selectedScheme, setSelectedScheme] = useState<any | null>(null)
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({})

  // Form state
  const [formData, setFormData] = useState({
    age: 35,
    income: 80000,
    caste: 'OBC',
    land_holding: 1.5,
    occupation: 'farmer',
    district: 'Khordha',
    gender: 'female',
    is_bpl: true,
  })

  useEffect(() => {
    fetchSchemes()
  }, [])

  const fetchSchemes = async () => {
    setIsLoading(true)
    try {
      const data = await getSchemes()
      if (data && data.length > 0) {
        setAllSchemes(data)
      }
    } catch {
      console.warn('Using offline scheme catalog fallback')
    } finally {
      setIsLoading(false)
    }
  }

  const runEvaluation = async (profileData: typeof formData) => {
    setIsEvaluating(true)
    try {
      const result = await checkEligibility(profileData)
      setMatchedSchemes(result.matched_schemes || [])
      setStep(6)
      toast.success(`Found ${result.total_found || result.matched_schemes?.length || 0} matching schemes!`)
    } catch {
      const fallbackMatched = allSchemes
        .filter((s) => {
          const name = (s.name_en || '').toLowerCase()
          if (name.includes('mamata') && (profileData.gender !== 'female' || profileData.age < 19)) return false
          if (name.includes('mission shakti') && (profileData.gender !== 'female' || profileData.age < 18)) return false
          if (name.includes('kalia') && !['farmer', 'laborer'].includes(profileData.occupation)) return false
          if (name.includes('pension') && profileData.age < 60 && profileData.income > 24000) return false
          if (name.includes('vidyalaya') && (profileData.age < 10 || profileData.age > 18)) return false
          if (name.includes('bsky') && !profileData.is_bpl && profileData.income > 300000) return false
          return true
        })
        .map((s) => ({ ...s, match_score: 94 }))
      setMatchedSchemes(fallbackMatched)
      setStep(6)
      toast.success(`Found ${fallbackMatched.length} matching schemes!`)
    } finally {
      setIsEvaluating(false)
    }
  }

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault()
    await runEvaluation(formData)
  }

  const handleQuickProfile = async (profileData: typeof formData) => {
    setFormData(profileData)
    await runEvaluation(profileData)
  }

  const openSchemeModal = (scheme: any) => {
    setSelectedScheme(scheme)
    setCheckedDocs({})
  }

  const departments = ['All', ...Array.from(new Set(allSchemes.map((s) => s.dept).filter(Boolean)))]

  const filteredCatalog = allSchemes.filter((s) => {
    if (selectedDept !== 'All' && s.dept !== selectedDept) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        (s.name_en || '').toLowerCase().includes(q) ||
        (s.name_odia || '').toLowerCase().includes(q) ||
        (s.benefits || '').toLowerCase().includes(q) ||
        (s.dept || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  const totalDocs = selectedScheme?.documents_required?.length || 0
  const readyDocs = Object.values(checkedDocs).filter(Boolean).length

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-3xl p-6 sm:p-10 text-white mb-8 shadow-md">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-600/40">
              Odisha Government Welfare Engine
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              ସରକାରୀ ଯୋଜନା ଯୋଗ୍ୟତା ପରୀକ୍ଷା (Scheme Eligibility)
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-2">
              Answer 5 quick questions — or tap a sample citizen profile below — to see all Odisha schemes you qualify for and prepare your documents.
            </p>
          </div>
        </div>

        {/* 1-Click Sample Profile Bar */}
        <div className="mb-6 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            ⚡ Quick Test with Sample Citizen Profiles (1-Click):
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROFILES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isEvaluating}
                onClick={() => handleQuickProfile(p.data)}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold transition-colors disabled:opacity-50"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-step Eligibility Wizard */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-12">
          {/* Step Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
              <span>STEP {step <= 5 ? step : 5} OF 5</span>
              <span>{step === 6 ? '100% COMPLETE' : `${(step - 1) * 20}%`}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${step === 6 ? 100 : (step - 1) * 20}%` }}
              ></div>
            </div>
          </div>

          {step <= 5 ? (
            <form onSubmit={handleEvaluate}>
              {/* Step 1: Age & Gender */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    ୧. ଆପଣଙ୍କ ବୟସ ଏବଂ ଲିଙ୍ଗ କଣ? (Age & Gender)
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Age / ବୟସ (Years)
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full max-w-xs p-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      min={1}
                      max={120}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Gender / ଲିଙ୍ଗ
                    </label>
                    <div className="flex gap-3">
                      {['female', 'male', 'other'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: g })}
                          className={`px-4 py-2.5 rounded-xl border text-sm font-semibold capitalize transition-all ${
                            formData.gender === g
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors"
                    >
                      Next Step / ପରବର୍ତ୍ତୀ →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Income & BPL */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    ୨. ବାର୍ଷିକ ପାରିବାରିକ ଆୟ? (Annual Family Income)
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Annual Income / ବାର୍ଷିକ ଆୟ (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.income}
                      onChange={(e) => setFormData({ ...formData, income: Number(e.target.value) })}
                      className="w-full max-w-xs p-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-sm text-slate-700 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_bpl}
                        onChange={(e) => setFormData({ ...formData, is_bpl: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span>Does your family hold a BPL / NFSA Ration Card? (ରାସନ କାର୍ଡ ଅଛି)</span>
                    </label>
                  </div>
                  <div className="pt-4 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700"
                    >
                      Next Step / ପରବର୍ତ୍ତୀ →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Social Category / Caste */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    ୩. ଆପଣଙ୍କ ବର୍ଗ ବା ଜାତି? (Caste Category)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg">
                    {['SC', 'ST', 'OBC', 'General'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData({ ...formData, caste: c })}
                        className={`p-3 rounded-xl border text-sm font-bold transition-all text-center ${
                          formData.caste === c
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="pt-4 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700"
                    >
                      Next Step / ପରବର୍ତ୍ତୀ →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Land holding */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    ୪. ଜମିର ପରିମାଣ କେତେ? (Agricultural Land Holding)
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Land holding in Acres / ଏକରରେ ଜମି (0 for landless)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.land_holding}
                      onChange={(e) => setFormData({ ...formData, land_holding: Number(e.target.value) })}
                      className="w-full max-w-xs p-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="pt-4 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700"
                    >
                      Next Step / ପରବର୍ତ୍ତୀ →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Occupation & District */}
              {step === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    ୫. ଆପଣଙ୍କ ବୃତ୍ତି ଏବଂ ଜିଲ୍ଲା? (Occupation & District)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Occupation / ବୃତ୍ତି
                      </label>
                      <select
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                      >
                        <option value="farmer">Farmer / କୃଷକ</option>
                        <option value="laborer">Agricultural Laborer / ଶ୍ରମିକ</option>
                        <option value="self_employed">Small Business / SHG Member</option>
                        <option value="artisan">Artisan / କାରିଗର</option>
                        <option value="student">Student / ଛାତ୍ର</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        District / ଜିଲ୍ଲା
                      </label>
                      <select
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full p-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                      >
                        {['Khordha', 'Cuttack', 'Puri', 'Ganjam', 'Sambalpur', 'Balasore', 'Mayurbhanj', 'Sundargarh'].map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="pt-4 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isEvaluating}
                      className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 flex items-center space-x-2 shadow-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isEvaluating ? 'Evaluating...' : 'Find My Schemes / ଯୋଜନା ଖୋଜନ୍ତୁ'}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            /* Results Step */
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 mb-6 gap-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    🎉 ଆପଣଙ୍କ ପାଇଁ ଉପଲବ୍ଧ ଯୋଜନା ({matchedSchemes.length} Schemes Matched)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Profile: {formData.occupation}, {formData.caste}, Age {formData.age}, Income ₹{formData.income.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors self-start sm:self-auto"
                >
                  Edit Answers / ପୁନଃ ଯାଞ୍ଚ
                </button>
              </div>

              {matchedSchemes.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                  <p className="font-semibold text-slate-700">No specific scheme rules matched this exact criteria.</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Visit the nearest Jan Seva Kendra or ask our AI assistant for alternative schemes.
                  </p>
                  <button
                    onClick={() => navigate('/#csc-locator')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    Find Nearest Jan Seva Kendra
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedSchemes.map((scheme, i) => (
                    <SchemeCard
                      key={scheme.id || i}
                      scheme={scheme}
                      onApply={() => openSchemeModal(scheme)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* All Catalog Section with Search & Filter */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                All Odisha Government Schemes ({filteredCatalog.length})
              </h2>
              <p className="text-xs text-slate-500">
                Search by keyword or filter by department, then click Apply Online for the document checklist.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scheme (e.g. KALIA, health)..."
                  className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-56"
                />
              </div>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'All Departments' : d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading && allSchemes.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500">Loading schemes...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  onApply={() => openSchemeModal(scheme)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Scheme Detail & Document Checklist Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1.5">
                  {selectedScheme.dept || 'Government of Odisha'}
                </span>
                <h3 className="text-xl font-black text-slate-900">{selectedScheme.name_odia}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedScheme.name_en}</p>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
              <div className="text-xs font-bold text-emerald-800 uppercase mb-1 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Scheme Benefits / ସୁବିଧା</span>
              </div>
              <p className="text-sm text-slate-800 leading-relaxed">{selectedScheme.benefits}</p>
            </div>

            {selectedScheme.eligibility_summary && (
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Who Can Apply / ଯୋଗ୍ୟତା
                </div>
                <p className="text-sm text-slate-700">{selectedScheme.eligibility_summary}</p>
              </div>
            )}

            {/* Interactive Document Readiness Checklist */}
            {selectedScheme.documents_required && selectedScheme.documents_required.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700 uppercase flex items-center space-x-1.5">
                    <FileCheck2 className="w-4 h-4 text-amber-600" />
                    <span>Document Readiness Checklist</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    {readyDocs} / {totalDocs} Ready
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedScheme.documents_required.map((doc: string, idx: number) => (
                    <label
                      key={idx}
                      className="flex items-center space-x-2.5 text-sm text-slate-700 cursor-pointer bg-white p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-400 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={!!checkedDocs[idx]}
                        onChange={(e) =>
                          setCheckedDocs({ ...checkedDocs, [idx]: e.target.checked })
                        }
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span className={checkedDocs[idx] ? 'line-through text-slate-400' : ''}>
                        {doc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {selectedScheme.helpline && (
              <div className="flex items-center space-x-2 text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
                <Phone className="w-4 h-4 text-amber-600" />
                <span>
                  Official Scheme Helpline: <strong>{selectedScheme.helpline}</strong>
                </span>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <a
                href={selectedScheme.apply_url || 'https://odisha.gov.in'}
                target="_blank"
                rel="noreferrer"
                className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5"
              >
                <span>Open Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  const q = `${selectedScheme.name_en} ବିଷୟରେ ବିସ୍ତୃତ ଭାବେ କୁହନ୍ତୁ ଏବଂ କିପରି ଆବେଦନ କରିବି?`
                  setSelectedScheme(null)
                  navigate(`/chat?q=${encodeURIComponent(q)}`)
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask AI Assistant</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedScheme(null)
                  navigate('/#csc-locator')
                }}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center space-x-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Nearest CSC</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
