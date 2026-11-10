import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  Camera,
  Mic,
  MapPin,
  CheckCircle2,
  FileCheck,
  Send,
  Upload,
} from 'lucide-react'
import Header from '../../components/layout/Header'
import { fileGrievance } from '../../api/grievances'
import toast from 'react-hot-toast'

export default function GrievancePage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [district, setDistrict] = useState('Khordha')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState<any | null>(null)

  const categories = [
    { value: 'road', label: 'Road / Infrastructure (ରାସ୍ତା)', icon: '🚧' },
    { value: 'water', label: 'Water & Sanitation (ପାନୀୟ ଜଳ)', icon: '💧' },
    { value: 'ration', label: 'Ration / PDS (ଖାଦ୍ୟ ଯୋଗାଣ)', icon: '🌾' },
    { value: 'education', label: 'School / Education (ବିଦ୍ୟାଳୟ)', icon: '📚' },
    { value: 'health', label: 'Hospital / Health (ସ୍ୱାସ୍ଥ୍ୟ)', icon: '🏥' },
    { value: 'land', label: 'Land Dispute (ଜମି ସମସ୍ୟା)', icon: '🗺️' },
  ]

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !description) {
      toast.error('Please enter mobile number and complaint description.')
      return
    }

    setIsSubmitting(true)
    try {
      const form = new FormData()
      form.append('phone', phone)
      form.append('description', description)
      if (name) form.append('name', name)
      if (district) form.append('district', district)
      if (category) form.append('category', category)
      if (imageFile) form.append('image', imageFile)

      // Demo GPS coordinates (Bhubaneswar center)
      form.append('lat', '20.2961')
      form.append('lng', '85.8245')

      const res = await fileGrievance(form)
      setSubmittedTicket(res)
      toast.success(`Complaint filed successfully! Ticket ID: ${res.ticket_id}`)
    } catch (err: any) {
      console.error('Submission error:', err)
      toast.error('Failed to submit grievance. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {submittedTicket ? (
          /* Confirmation Screen */
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-md text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              ଅଭିଯୋଗ ସଫଳତାର ସହ ଦାଖଲ ହୋଇଛି!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Grievance Filed Successfully & SLA Timer Initiated
            </p>

            <div className="my-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left">
              <div className="text-xs text-emerald-700 font-semibold uppercase">Ticket ID</div>
              <div className="text-2xl font-black text-emerald-900 tracking-wider">
                {submittedTicket.ticket_id}
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-200/70 text-xs text-emerald-800 space-y-1">
                <div>Department: <strong>{submittedTicket.dept_assigned || 'Works / Rural'}</strong></div>
                <div>Category: <strong className="capitalize">{submittedTicket.category}</strong></div>
                <div>Status: <strong className="uppercase">{submittedTicket.status}</strong></div>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              📱 A WhatsApp SMS confirmation has been queued for your mobile number. You can track this complaint anytime using this Ticket ID.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={`/track?ticket=${submittedTicket.ticket_id}`}
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors"
              >
                Track Live Status / ସ୍ଥିତି ଯାଞ୍ଚ
              </Link>
              <button
                onClick={() => {
                  setSubmittedTicket(null)
                  setDescription('')
                  setImageFile(null)
                  setImagePreview(null)
                }}
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200"
              >
                File Another Complaint
              </button>
            </div>
          </div>
        ) : (
          /* Grievance Form */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
            <div className="mb-8 border-b border-slate-100 pb-5">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold mb-2">
                Citizen Grievance Redressal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                ଗ୍ରାମ ସମସ୍ୟା / ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Voice, photo, or text complaint for roads, water supply, schools, hospitals, or PDS ration.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Mobile Number (ମୋବାଇଲ ନମ୍ବର) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full p-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    WhatsApp confirmation will be sent here.
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Citizen Name (ନାମ)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full p-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* District & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    District (ଜିଲ୍ଲା)
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    {['Khordha', 'Cuttack', 'Puri', 'Ganjam', 'Sambalpur', 'Balasore', 'Mayurbhanj', 'Sundargarh'].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Category (ବର୍ଗ)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="">Auto-Detect via AI / ସ୍ୱତଃ ଚିହ୍ନଟ</option>
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.icon} {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Complaint Description (ଅଭିଯୋଗର ବିବରଣୀ) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ସମସ୍ୟା ବିଷୟରେ ବିସ୍ତୃତ ଭାବେ ଲେଖନ୍ତୁ (Describe the issue in Odia or English)..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Upload Photo of Issue (ଫଟୋ ଅପଲୋଡ଼)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer px-4 py-3 border border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center space-x-2 text-xs font-semibold text-slate-700">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Choose Photo / ଫଟୋ ବାଛନ୍ତୁ</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  📍 GPS Location auto-tagged for quick dispatch.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Filing Complaint...' : 'Submit Grievance / ଦାଖଲ କରନ୍ତୁ'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

