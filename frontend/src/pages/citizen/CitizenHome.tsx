import React from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, FileText, AlertCircle, Search, ArrowRight, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react'
import Header from '../../components/layout/Header'

export default function CitizenHome() {
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
      desc: 'Answer 5 quick questions to find all Odisha schemes you qualify for.',
      icon: FileText,
      to: '/schemes',
      color: 'bg-blue-600',
      tag: '8+ Schemes',
    },
    {
      title: 'File a Grievance',
      titleOdia: 'ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ',
      desc: 'Report road, water, ration or health issues with photos & voice.',
      icon: AlertCircle,
      to: '/grievance',
      color: 'bg-amber-600',
      tag: 'WhatsApp Updates',
    },
    {
      title: 'Track Grievance Status',
      titleOdia: 'ଅଭିଯୋଗର ସ୍ଥିତି ଯାଞ୍ଚ',
      desc: 'Check live progress of your ticket with official SLA tracking.',
      icon: Search,
      to: '/track',
      color: 'bg-purple-600',
      tag: 'Live Tracking',
    },
  ]

  const stats = [
    { label: 'Odisha Schemes / ଯୋଜନା', value: '8+' },
    { label: 'Official Departments / ବିଭାଗ', value: '6+' },
    { label: 'Voice & Dialect Support', value: '100%' },
    { label: 'WhatsApp SLA Tracking', value: '24x7' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-xs sm:text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Odisha AI Hackathon 2026 • Social Good</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4">
            ଆପଣଙ୍କ ଅଧିକାର, <span className="text-amber-300">ଆମର ସେବା</span>
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto font-medium mb-8">
            AI-powered governance for every Odia citizen. Speak or type in Odia to check schemes, file grievances, and get instant public services.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/chat"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5 text-slate-900" />
              <span>Talk to GraamSeva AI / କଥାବାର୍ତ୍ତା</span>
            </Link>
            <Link
              to="/schemes"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base backdrop-blur-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Check Eligibility / ଯୋଜନା ଯାଞ୍ଚ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Citizen Public Services / ସେବାସମୂହ
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Select an option below or speak directly to our AI assistant.
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
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
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

        {/* Info Highlights */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <h4 className="font-bold text-slate-900 text-base">Local Jan Seva Kendra Help</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Easily discover the nearest CSC Jan Seva Kendra for in-person document filing and biometric help.
              </p>
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

