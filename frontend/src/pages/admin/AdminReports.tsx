import React from 'react'
import { FileText, Download, Printer, CheckCircle2, TrendingUp, Calendar } from 'lucide-react'

export default function AdminReports() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Panchayat Weekly Governance Report
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Official summary report for District Collector and Department Heads.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Export / Print PDF</span>
        </button>
      </div>

      {/* Report Sheet */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-8">
        <div className="border-b border-slate-200 pb-6 flex items-start justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Government of Odisha • Panchayati Raj & DW Dept
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Public Grievance Redressal Audit Report
            </h2>
            <div className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Reporting Period: November 01 – November 10, 2026</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Grade A (92% SLA Compliance)
            </span>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Complaints</span>
            <div className="text-2xl font-black text-slate-900 mt-1">142 Cases</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">↑ 14% via Odia AI Voice Bot</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold uppercase">Average Resolution Time</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">4.2 Days</div>
            <div className="text-[11px] text-slate-500 mt-1">Within standard 7-day target</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold uppercase">Citizen Feedback</span>
            <div className="text-2xl font-black text-amber-600 mt-1">4.8 / 5.0</div>
            <div className="text-[11px] text-slate-500 mt-1">From automated WhatsApp survey</div>
          </div>
        </div>

        {/* Department Table */}
        <div>
          <h3 className="font-bold text-sm text-slate-800 mb-3 uppercase tracking-wider">
            Department Performance Breakdown
          </h3>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-bold">
                <th className="py-2.5 px-4 rounded-l-lg">Department</th>
                <th className="py-2.5 px-4">Received</th>
                <th className="py-2.5 px-4">Resolved</th>
                <th className="py-2.5 px-4">Overdue</th>
                <th className="py-2.5 px-4 rounded-r-lg">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Works Department (Roads)</td>
                <td className="py-3 px-4">48</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">39</td>
                <td className="py-3 px-4 text-rose-600">3</td>
                <td className="py-3 px-4 font-bold">81.2%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Panchayati Raj & Drinking Water</td>
                <td className="py-3 px-4">35</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">32</td>
                <td className="py-3 px-4 text-rose-600">1</td>
                <td className="py-3 px-4 font-bold">91.4%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Food Supplies & Consumer Welfare</td>
                <td className="py-3 px-4">24</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">23</td>
                <td className="py-3 px-4 text-slate-400">0</td>
                <td className="py-3 px-4 font-bold">95.8%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Health & Family Welfare</td>
                <td className="py-3 px-4">18</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">16</td>
                <td className="py-3 px-4 text-rose-600">1</td>
                <td className="py-3 px-4 font-bold">88.9%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

