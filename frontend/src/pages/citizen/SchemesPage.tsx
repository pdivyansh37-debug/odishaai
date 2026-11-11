import React, { useState, useEffect } from 'react'
import { CheckCircle2, Search, Filter, Sparkles, AlertCircle, ArrowRight } from 'lucide-react'
import Header from '../../components/layout/Header'
import SchemeCard from '../../components/schemes/SchemeCard'
import { getSchemes, checkEligibility } from '../../api/schemes'
import toast from 'react-hot-toast'

const FALLBACK_SCHEMES = [
  {
    id: 1,
    name_odia: 'ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନା (BSKY)',
    name_en: 'Biju Swasthya Kalyan Yojana (BSKY)',
    dept: 'Health & Family Welfare',
    benefits: 'Free healthcare coverage up to ₹5 Lakh per family per annum (₹10 Lakh for women) at 600+ empanelled hospitals.',
    documents_required: ['BSKY Smart Card / Ration Card', 'Aadhaar Card', 'Odisha Resident Certificate'],
  },
  {
    id: 2,
    name_odia: 'କାଳିଆ ଯୋଜନା (KALIA)',
    name_en: 'Krushak Assistance for Livelihood and Income Augmentation (KALIA)',
    dept: 'Agriculture & Farmers\' Empowerment',
    benefits: '₹10,000/year direct financial assistance for cultivation (₹5,000 Kharif + ₹5,000 Rabi) + ₹12,500 for landless households.',
    documents_required: ['Aadhaar Card', 'Bank Passbook', 'Land Patta / Landless Certificate'],
  },
  {
    id: 3,
    name_odia: 'ମମତା ଯୋଜନା (MAMATA)',
    name_en: 'Mamata Yojana',
    dept: 'Women & Child Development',
    benefits: 'Conditional cash transfer of ₹5,000 in two installments to pregnant and lactating women aged 19+.',
    documents_required: ['MCP Card', 'Aadhaar Card of Mother', 'Bank Passbook'],
  },
  {
    id: 4,
    name_odia: 'ମିଶନ ଶକ୍ତି (Mission Shakti)',
    name_en: 'Mission Shakti Self-Help Group (SHG) Scheme',
    dept: 'Mission Shakti Department',
    benefits: 'Interest-free loans up to ₹5 Lakh, seed capital of ₹15,000 per SHG, and institutional business support.',
    documents_required: ['SHG Registration Certificate', 'SHG Bank Passbook', 'Aadhaar Card of Members'],
  },
  {
    id: 5,
    name_odia: 'ମଧୁବାବୁ ପେନସନ ଯୋଜନା (MBPY)',
    name_en: 'Madhu Babu Pension Yojana (MBPY)',
    dept: 'Social Security & Empowerment of PwDs',
    benefits: 'Monthly pension of ₹500 - ₹1,000 for senior citizens (60+), widows, and persons with 40%+ disabilities.',
    documents_required: ['Age Proof / Aadhaar', 'Income Certificate', 'Bank Passbook'],
  },
  {
    id: 6,
    name_odia: 'ବିଜୁ ପକ୍କା ଘର ଯୋଜନା (BPGY)',
    name_en: 'Biju Pucca Ghar Yojana (BPGY)',
    dept: 'Panchayati Raj & Drinking Water',
    benefits: 'Financial assistance of ₹1.20 Lakh - ₹1.30 Lakh + 90 MGNREGS wage days for pucca house construction.',
    documents_required: ['Aadhaar Card', 'Ration Card / BPL Number', 'Land Patta'],
  },
]

export default function SchemesPage() {
  const [allSchemes, setAllSchemes] = useState<any[]>(FALLBACK_SCHEMES)
  const [matchedSchemes, setMatchedSchemes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [step, setStep] = useState(1)

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
    } catch (err) {
      console.warn('Using offline scheme catalog fallback')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEvaluating(true)
    try {
      const result = await checkEligibility(formData)
      setMatchedSchemes(result.matched_schemes || [])
      setStep(6) // Result step
      toast.success(`Found ${result.total_found || result.matched_schemes?.length || 0} matching schemes!`)
    } catch (err) {
      // Local rule evaluation fallback when backend is unreachable
      const fallbackMatched = allSchemes
        .filter((s) => {
          if (s.id === 3 && formData.gender !== 'female') return false
          if (s.id === 4 && formData.gender !== 'female') return false
          if (s.id === 2 && formData.occupation !== 'farmer' && formData.occupation !== 'laborer') return false
          return true
        })
        .map((s) => ({ ...s, match_score: 92 }))
      setMatchedSchemes(fallbackMatched)
      setStep(6)
      toast.success(`Found ${fallbackMatched.length} matching schemes!`)
    } finally {
      setIsEvaluating(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-3xl p-6 sm:p-10 text-white mb-10 shadow-md">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-600/40">
              Odisha Government Welfare Engine
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              ସରକାରୀ ଯୋଜନା ଯୋଗ୍ୟତା ପରୀକ୍ଷା (Scheme Eligibility)
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-2">
              Answer 5 simple questions to see which Odisha state and central government assistance programs you qualify for today.
            </p>
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
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    🎉 ଆପଣଙ୍କ ପାଇଁ ଉପଲବ୍ଧ ଯୋଜନା ({matchedSchemes.length} Schemes Matched)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Based on your profile: {formData.occupation}, {formData.caste}, Age {formData.age}, Income ₹{formData.income}
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  Recalculate / ପୁନଃ ଯାଞ୍ଚ
                </button>
              </div>

              {matchedSchemes.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                  <p className="font-semibold text-slate-700">No specific scheme rules matched this criteria.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Please visit the nearest Jan Seva Kendra for personalized assistance.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedSchemes.map((scheme, i) => (
                    <SchemeCard key={scheme.id || i} scheme={scheme} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* All Catalog Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                All Odisha Government Schemes / ସମସ୍ତ ସରକାରୀ ଯୋଜନା
              </h2>
              <p className="text-xs text-slate-500">Browse complete catalog of public welfare programs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

