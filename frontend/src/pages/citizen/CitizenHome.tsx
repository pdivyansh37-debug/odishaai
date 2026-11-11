import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  FileText,
  AlertCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  CheckCircle2,
  Mic,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { useChatStore } from '../../stores/chatStore'
import { ODISHA_CSC_CENTERS, UI_COPY } from '../../data/odishaData'

export default function CitizenHome() {
  const navigate = useNavigate()
  const { language } = useChatStore()
  const copy = UI_COPY[language] || UI_COPY.or

  const [quickTicket, setQuickTicket] = useState('')
  const [cscDistrict, setCscDistrict] = useState('All')

  const quickActions = [
    {
      title: 'AI Chat in Odia',
      titleOdia: 'ଓଡ଼ିଆରେ AI ସହିତ କଥା ହୁଅନ୍ତୁ',
      desc: 'Ask any question about schemes, rights, or grievances via voice or text.',
      icon: MessageSquare,
      to: '/chat',
      color: 'bg-emerald-600',
      tag: 'Voice & Text',
    },
    {
      title: 'Scheme Eligibility',
      titleOdia: 'ସରକାରୀ ଯୋଜନା ଯୋଗ୍ୟତା',
      desc: 'Answer 5 quick questions (or tap a sample profile) to find schemes you qualify for.',
      icon: FileText,
      to: '/schemes',
      color: 'bg-blue-600',
      tag: '8 Real Schemes',
    },
    {
      title: 'File a Grievance',
      titleOdia: 'ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ',
      desc: 'Report road, water, ration or health issues with voice dictation, GPS & photo.',
      icon: AlertCircle,
      to: '/grievance',
      color: 'bg-amber-600',
      tag: 'SLA Tracked',
    },
    {
      title: 'Track Grievance Status',
      titleOdia: 'ଅଭିଯୋଗର ସ୍ଥିତି ଯାଞ୍ଚ',
      desc: 'Check live progress of your ticket with department & SLA countdown.',
      icon: Search,
      to: '/track',
      color: 'bg-purple-600',
      tag: 'Live Status',
    },
  ]

  const stepsGuide = [
    {
      num: '01',
      title: language === 'or' ? 'ଭାଷା ବାଛନ୍ତୁ ଏବଂ କୁହନ୍ତୁ' : language === 'hi' ? 'भाषा चुनें और बोलें' : 'Choose Language & Ask',
      desc: 'Select Odia, Hindi, or English. Speak or type naturally — no technical words needed.',
      icon: Mic,
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      num: '02',
      title: language === 'or' ? 'AI ସଠିକ୍ ଯୋଜନା ଓ ବିଭାଗ ଖୋଜିବ' : language === 'hi' ? 'AI सही योजना व विभाग चुनेगा' : 'AI Matches Schemes & Routes',
      desc: 'Gemini AI checks 8+ Odisha schemes or automatically routes your complaint to the right department.',
      icon: CheckCircle2,
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      num: '03',
      title: language === 'or' ? 'ଟିକେଟ୍ ଏବଂ WhatsApp ଅପଡେଟ୍' : language === 'hi' ? 'टिकट और WhatsApp अपडेट' : 'Track Live with SLA & Alerts',
      desc: 'Get an instant Ticket ID, document checklist, nearest CSC address, and WhatsApp alerts.',
      icon: ShieldCheck,
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ]

  const stats = [
    { label: 'Odisha Schemes / ଯୋଜନା', value: '8+' },
    { label: 'Official Departments / ବିଭାଗ', value: '6+' },
    { label: 'Voice & Dialect Support', value: '100%' },
    { label: 'WhatsApp SLA Tracking', value: '24x7' },
  ]

  const helplines = [
    { name: 'Emergency Police/Fire', number: '112' },
    { name: 'BSKY / Health Helpline', number: '104' },
    { name: 'Women Helpline (Mamata)', number: '181' },
    { name: 'PDS / Ration Toll-Free', number: '1967' },
  ]

  const filteredCscs =
    cscDistrict === 'All'
      ? ODISHA_CSC_CENTERS
      : ODISHA_CSC_CENTERS.filter((c) => c.district === cscDistrict)

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickTicket.trim()) return
    navigate(`/track?ticket=${encodeURIComponent(quickTicket.trim().toUpperCase())}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-xs sm:text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Odisha AI Hackathon 2026 • Citizen-First Governance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4">
            {copy.heroTitle} <span className="text-amber-300">{copy.heroHighlight}</span>
          </h1>
          <p className="text-base sm:text-xl text-emerald-100 max-w-2xl mx-auto font-medium mb-8">
            {copy.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/chat"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5 text-slate-900" />
              <span>{copy.talkAiBtn}</span>
            </Link>
            <Link
              to="/schemes"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base backdrop-blur-md transition-all flex items-center justify-center space-x-2"
            >
              <span>{copy.checkSchemeBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Ticket Tracker Bar */}
          <form
            onSubmit={handleQuickTrack}
            className="mt-8 max-w-xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              value={quickTicket}
              onChange={(e) => setQuickTicket(e.target.value)}
              placeholder={copy.quickTrackPlaceholder}
              className="flex-1 bg-white text-slate-900 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-950 hover:bg-slate-900 text-white font-bold text-sm flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Search className="w-4 h-4 text-amber-300" />
              <span>{copy.quickTrackBtn}</span>
            </button>
          </form>
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-100/90">
            <span>Try sample ticket:</span>
            <button
              type="button"
              onClick={() => navigate('/track?ticket=GS-ROAD-2026-001001')}
              className="underline font-mono hover:text-amber-300 transition-colors"
            >
              GS-ROAD-2026-001001
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => navigate('/track?ticket=GS-WATER-2026-001002')}
              className="underline font-mono hover:text-amber-300 transition-colors"
            >
              GS-WATER-2026-001002
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="border-r last:border-none border-slate-100">
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Action Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {copy.servicesHeading}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            {copy.servicesSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => {
            const Icon = action.icon
            return (
              <Link
                key={i}
                to={action.to}
                className="group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-emerald-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${action.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {action.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {action.title}
                  </h3>
                  <div className="text-xs font-semibold text-emerald-600 mt-0.5 mb-2">
                    {action.titleOdia}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                  <span>Open Service</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* 3-Step Easy User Guide */}
        <div className="mt-14 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{copy.howTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stepsGuide.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.num}
                  className="rounded-2xl p-5 bg-slate-50 border border-slate-200/70 flex flex-col space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className={`p-2.5 rounded-xl border ${s.bg}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-2xl font-black text-slate-200">{s.num}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Interactive Jan Seva Kendra (CSC) Locator */}
        <div id="csc-locator" className="mt-14 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Offline Assistance</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{copy.cscTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">{copy.cscSub}</p>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs font-bold text-slate-600">District:</label>
              <select
                value={cscDistrict}
                onChange={(e) => setCscDistrict(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Districts</option>
                {Array.from(new Set(ODISHA_CSC_CENTERS.map((c) => c.district))).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCscs.map((center) => (
              <div
                key={center.id}
                className="rounded-2xl p-4 border border-slate-200 bg-slate-50/60 hover:border-emerald-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{center.name}</h4>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      {center.district}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{center.address}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {center.services.map((srv, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700 font-medium"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  <div className="text-slate-500 space-y-0.5">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{center.timings}</span>
                    </div>
                    <div className="flex items-center space-x-1 font-semibold text-slate-700">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{center.phone}</span>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.name + ' ' + center.district + ' Odisha')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1"
                  >
                    <span>Map</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Helplines & Highlights */}
        <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Odisha Citizen Toll-Free Helplines / ଜରୁରୀକାଳୀନ ନମ୍ବର
                </h4>
                <p className="text-xs text-slate-600">Tap any number on mobile to dial directly.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {helplines.map((h) => (
                <a
                  key={h.number}
                  href={`tel:${h.number}`}
                  className="bg-white border border-amber-200 hover:border-amber-400 rounded-xl px-3 py-2 text-center shadow-2xs transition-colors"
                >
                  <div className="text-base font-black text-amber-700">{h.number}</div>
                  <div className="text-[11px] font-semibold text-slate-600 truncate">{h.name}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Info Highlights */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6 flex items-start space-x-4">
            <div className="p-3 bg-emerald-600 text-white rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Direct Government Accountability</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Every grievance is auto-assigned an SLA deadline and escalated to the Collector if delayed.
              </p>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 flex items-start space-x-4">
            <div className="p-3 bg-amber-600 text-white rounded-xl">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Odia First & Inclusive</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Built specifically for rural citizens with speech recognition, image upload, and simple language.
              </p>
            </div>
          </div>

          <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-6 flex items-start space-x-4">
            <div className="p-3 bg-purple-600 text-white rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Officer & Panchayat Portal</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Officers can review GIS heatmaps, track SLAs, and send 1-click AI Odia replies.
              </p>
              <Link
                to="/admin/login"
                className="inline-block mt-2 text-xs font-bold text-purple-700 hover:underline"
              >
                Open Officer Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-300">
            GraamSeva AI — ଗ୍ରାମ ସେବା AI | Odisha AI Hackathon 2026
          </p>
          <p className="mt-1 text-slate-500">
            Empowering Panchayat governance through responsible Artificial Intelligence.
          </p>
        </div>
      </footer>
    </div>
  )
}
