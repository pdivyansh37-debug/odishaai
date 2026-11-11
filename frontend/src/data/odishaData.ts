import { Language } from '../types'

export interface OdishaSchemeItem {
  id: number
  name_odia: string
  name_en: string
  dept: string
  category_tag: 'Health' | 'Agriculture' | 'Women' | 'Pension' | 'Housing' | 'Education'
  benefits: string
  eligibility_summary: string
  documents_required: string[]
  apply_url: string
  helpline: string
}

export const ODISHA_SCHEMES: OdishaSchemeItem[] = [
  {
    id: 1,
    name_odia: 'ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନା (BSKY)',
    name_en: 'Biju Swasthya Kalyan Yojana (BSKY)',
    dept: 'Health & Family Welfare',
    category_tag: 'Health',
    benefits:
      'Free cashless healthcare coverage up to ₹5 Lakh per family per annum (₹10 Lakh for women family members) at 600+ empanelled hospitals.',
    eligibility_summary: 'Odisha residents holding NFSA / SFSS Ration Card or BSKY Smart Health Card.',
    documents_required: [
      'BSKY Smart Card or NFSA/SFSS Ration Card',
      'Aadhaar Card of family members',
      'Odisha Resident Certificate',
    ],
    apply_url: 'https://bsky.odisha.gov.in/',
    helpline: '104 / 155369',
  },
  {
    id: 2,
    name_odia: 'କାଳିଆ ଯୋଜନା (KALIA)',
    name_en: 'Krushak Assistance for Livelihood and Income Augmentation (KALIA)',
    dept: "Agriculture & Farmers' Empowerment",
    category_tag: 'Agriculture',
    benefits:
      '₹10,000/year direct financial assistance for cultivation (₹5,000 Kharif + ₹5,000 Rabi) + ₹12,500 support for landless agricultural households.',
    eligibility_summary: 'Small & marginal farmers (up to 5 acres) or landless agricultural households in Odisha.',
    documents_required: [
      'Aadhaar Card',
      'Aadhaar-linked Bank Passbook',
      'Land Ownership Record (RoR / Patta) or Landless Certificate',
      'Ration Card',
    ],
    apply_url: 'https://kalia.odisha.gov.in/',
    helpline: '1800-572-1122',
  },
  {
    id: 3,
    name_odia: 'ମମତା ଯୋଜନା (MAMATA)',
    name_en: 'Mamata Yojana',
    dept: 'Women & Child Development',
    category_tag: 'Women',
    benefits:
      'Conditional cash transfer of ₹5,000 in two installments directly to bank accounts of pregnant and lactating mothers.',
    eligibility_summary: 'Pregnant & lactating women aged 19+ for first two live births (excluding Govt/PSU staff).',
    documents_required: [
      'Mother & Child Protection (MCP) Card from Anganwadi',
      'Aadhaar Card of Mother',
      'Bank Passbook in mother’s name',
    ],
    apply_url: 'https://wcd.odisha.gov.in/',
    helpline: '181',
  },
  {
    id: 4,
    name_odia: 'ମିଶନ ଶକ୍ତି (Mission Shakti)',
    name_en: 'Mission Shakti Self-Help Group (SHG) Scheme',
    dept: 'Mission Shakti Department',
    category_tag: 'Women',
    benefits:
      '0% interest bank loans up to ₹5 Lakh, seed capital of ₹15,000 per SHG, revolving fund support, and market linkage.',
    eligibility_summary: 'Women aged 18+ who are members of a registered Self-Help Group (WSHG) in Odisha.',
    documents_required: [
      'SHG Registration Certificate',
      'SHG Joint Bank Passbook',
      'Aadhaar Card of Members',
      'SHG Loan Resolution Copy',
    ],
    apply_url: 'https://missionshakti.odisha.gov.in/',
    helpline: '1800-345-6724',
  },
  {
    id: 5,
    name_odia: 'ମଧୁବାବୁ ପେନସନ ଯୋଜନା (MBPY)',
    name_en: 'Madhu Babu Pension Yojana (MBPY)',
    dept: 'Social Security & Empowerment of PwDs',
    category_tag: 'Pension',
    benefits:
      'Monthly pension of ₹500 to ₹1,000 for senior citizens (60+), widows of any age, and persons with 40%+ disabilities.',
    eligibility_summary: 'Annual family income below ₹24,000; senior citizen (60+), widow, or PwD (40%+).',
    documents_required: [
      'Age Proof / Aadhaar Card',
      'Income Certificate from Tahsildar',
      'Disability / Death Certificate (if applicable)',
      'Bank Passbook',
    ],
    apply_url: 'https://ssepd.odisha.gov.in/',
    helpline: '1800-345-7150',
  },
  {
    id: 6,
    name_odia: 'ବିଜୁ ପକ୍କା ଘର ଯୋଜନା (BPGY)',
    name_en: 'Biju Pucca Ghar Yojana (BPGY)',
    dept: 'Panchayati Raj & Drinking Water',
    category_tag: 'Housing',
    benefits:
      '₹1.20 Lakh (Plain) to ₹1.30 Lakh (IAP/Hilly areas) + 90 person-days of MGNREGS wages to build a pucca house.',
    eligibility_summary: 'Rural Odisha households living in kutcha houses and not owning a pucca house.',
    documents_required: [
      'Aadhaar Card',
      'Ration Card / BPL Number',
      'Land Patta / Allotment Letter',
      'Photo of Existing Kutcha House',
    ],
    apply_url: 'https://rhodisha.gov.in/',
    helpline: '1800-345-6768',
  },
  {
    id: 7,
    name_odia: 'ମୁଖ୍ୟମନ୍ତ୍ରୀ କୃଷି ଉଦ୍ୟୋଗ ଯୋଜନା (MKUY)',
    name_en: 'Mukhyamantri Krishi Udyog Yojana (MKUY)',
    dept: "Agriculture & Farmers' Empowerment",
    category_tag: 'Agriculture',
    benefits:
      'Capital Investment Subsidy up to 40% (50% for SC/ST/Women/Graduates), maximum up to ₹50 Lakh for setting up agro-enterprises.',
    eligibility_summary: 'Entrepreneurs, farmers, SHGs & FPOs aged 18–65 starting commercial agri-ventures in Odisha.',
    documents_required: [
      'Detailed Project Report (DPR)',
      'Land Records (Owned or 15-yr Lease)',
      'Aadhaar & PAN Card',
      'Bank Appraisal / Sanction Letter',
    ],
    apply_url: 'https://apicol.odisha.gov.in/',
    helpline: '1800-345-7100',
  },
  {
    id: 8,
    name_odia: 'ଓଡ଼ିଶା ଆଦର୍ଶ ବିଦ୍ୟାଳୟ ବୃତ୍ତି (OAVS)',
    name_en: 'Odisha Adarsha Vidyalaya Merit Scholarship',
    dept: 'School & Mass Education Department',
    category_tag: 'Education',
    benefits:
      'Free CBSE English-medium schooling (Class VI–XII), free hostel facility, books, uniforms, and merit scholarships.',
    eligibility_summary: 'Odisha rural students aged 10–18 qualifying the OAVS block-level entrance exam (50% seats for girls).',
    documents_required: [
      'Previous Class Marksheet',
      'Birth Certificate',
      'Student & Parent Aadhaar Card',
      'Resident & Caste Certificate',
    ],
    apply_url: 'https://oav.edu.in/',
    helpline: '0674-2302334',
  },
]

export interface CscCenter {
  id: number
  name: string
  district: string
  block: string
  address: string
  services: string[]
  timings: string
  phone: string
}

export const ODISHA_CSC_CENTERS: CscCenter[] = [
  {
    id: 1,
    name: 'Mo Seba Kendra — Balipatna',
    district: 'Khordha',
    block: 'Balipatna',
    address: 'Near Panchayat Samiti Office, Balipatna Main Road, Khordha 752102',
    services: ['KALIA & BSKY Card', 'Income & Caste Certificate', 'Aadhaar Update'],
    timings: '9:30 AM – 6:00 PM (Mon–Sat)',
    phone: '0674-2461022',
  },
  {
    id: 2,
    name: 'Jan Seva Kendra — Salepur',
    district: 'Cuttack',
    block: 'Salepur',
    address: 'Block Chhak, Opposite Tahasil Office, Salepur, Cuttack 754202',
    services: ['Madhu Babu Pension', 'Ration Card eKYC', 'BPGY Application'],
    timings: '9:00 AM – 6:30 PM (Mon–Sat)',
    phone: '0671-2352108',
  },
  {
    id: 3,
    name: 'Mo Seba Kendra — Satyabadi',
    district: 'Puri',
    block: 'Satyabadi',
    address: 'Sakhigopal Bazar, Near Bus Stand, Puri 752014',
    services: ['Mamata Yojana Form', 'Land Patta Print (Bhulekh)', 'Banking BC'],
    timings: '10:00 AM – 6:00 PM (Mon–Sat)',
    phone: '06752-274310',
  },
  {
    id: 4,
    name: 'Jan Seva Kendra — Burla / Sambalpur',
    district: 'Sambalpur',
    block: 'Dhankauda',
    address: 'Near GP Office, Dhankauda, Sambalpur 768001',
    services: ['MKUY Subsidy Upload', 'KALIA Grievance', 'Caste Certificate'],
    timings: '9:30 AM – 5:30 PM (Mon–Sat)',
    phone: '0663-2430119',
  },
  {
    id: 5,
    name: 'Mo Seba Kendra — Chhatrapur',
    district: 'Ganjam',
    block: 'Chhatrapur',
    address: 'College Road, Near Block Office, Chhatrapur, Ganjam 761020',
    services: ['Mission Shakti SHG', 'OAVS Entrance Form', 'BSKY Registration'],
    timings: '9:30 AM – 6:00 PM (Mon–Sat)',
    phone: '06811-262045',
  },
  {
    id: 6,
    name: 'Jan Seva Kendra — Remuna',
    district: 'Balasore',
    block: 'Remuna',
    address: 'Golei Chhak, Remuna, Balasore 756019',
    services: ['Farmer Registration', 'Pension Life Cert', 'Ration Correction'],
    timings: '9:30 AM – 6:00 PM (Mon–Sat)',
    phone: '06782-265412',
  },
]

export const DEMO_TICKETS: Record<string, any> = {
  'GS-ROAD-2026-001001': {
    ticket_id: 'GS-ROAD-2026-001001',
    category: 'road',
    dept_assigned: 'Works Department',
    status: 'pending',
    description:
      'Main village road connecting Balipatna to NH-16 has large potholes after heavy rain, making transport impossible.',
    citizen_name: 'Bikash Mohanty',
    citizen_phone: '9876543210',
    district: 'Khordha',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    sla_deadline: new Date(Date.now() + 13 * 86400000).toISOString(),
  },
  'GS-WATER-2026-001002': {
    ticket_id: 'GS-WATER-2026-001002',
    category: 'water',
    dept_assigned: 'Panchayati Raj & Drinking Water',
    status: 'in_progress',
    description:
      'Village tubewell has been non-functional for past 2 weeks in Salepur block. 50 families facing drinking water shortage.',
    citizen_name: 'Priyanka Sahoo',
    citizen_phone: '9876543211',
    district: 'Cuttack',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    sla_deadline: new Date(Date.now() + 4 * 86400000).toISOString(),
  },
  'GS-RATION-2026-001003': {
    ticket_id: 'GS-RATION-2026-001003',
    category: 'ration',
    dept_assigned: 'Food Supplies & Consumer Welfare',
    status: 'resolved',
    description:
      'PDS dealer in Satyabadi block refused to distribute November quota rice and demanded extra charges.',
    citizen_name: 'Kailash Nayak',
    citizen_phone: '9876543212',
    district: 'Puri',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    sla_deadline: new Date(Date.now() - 1 * 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
}

const LOCAL_TICKETS_KEY = 'graamseva_local_tickets'

export function saveLocalTicket(ticket: any) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_TICKETS_KEY) || '{}')
    existing[ticket.ticket_id.toUpperCase()] = ticket
    localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(existing))
  } catch {
    // ignore storage errors
  }
}

export function getLocalTicket(ticketId: string): any | null {
  const key = ticketId.trim().toUpperCase()
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_TICKETS_KEY) || '{}')
    if (local[key]) return local[key]
  } catch {
    // ignore storage errors
  }
  return DEMO_TICKETS[key] || null
}

export const SLA_DAYS_MAP: Record<string, { days: number; dept: string }> = {
  road: { days: 15, dept: 'Works Department' },
  water: { days: 7, dept: 'Panchayati Raj & Drinking Water' },
  ration: { days: 3, dept: 'Food Supplies & Consumer Welfare' },
  education: { days: 10, dept: 'School & Mass Education' },
  health: { days: 5, dept: 'Health & Family Welfare' },
  land: { days: 21, dept: 'Revenue & Disaster Management' },
  other: { days: 10, dept: 'General Administration' },
}

export const UI_COPY: Record<
  Language,
  {
    heroTitle: string
    heroHighlight: string
    heroSubtitle: string
    talkAiBtn: string
    checkSchemeBtn: string
    servicesHeading: string
    servicesSub: string
    howTitle: string
    quickTrackPlaceholder: string
    quickTrackBtn: string
    cscTitle: string
    cscSub: string
  }
> = {
  or: {
    heroTitle: 'ଆପଣଙ୍କ ଅଧିକାର,',
    heroHighlight: 'ଆମର ସେବା',
    heroSubtitle:
      'ପ୍ରତ୍ୟେକ ଓଡ଼ିଆ ନାଗରିକଙ୍କ ପାଇଁ AI ପରିଚାଳିତ ସେବା। ଓଡ଼ିଆରେ କୁହନ୍ତୁ ବା ଲେଖନ୍ତୁ — ସରକାରୀ ଯୋଜନା ଖୋଜନ୍ତୁ ଏବଂ ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ।',
    talkAiBtn: 'ଗ୍ରାମ ସେବା AI ସହିତ କଥା ହୁଅନ୍ତୁ',
    checkSchemeBtn: 'ଯୋଜନା ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ',
    servicesHeading: 'ନାଗରିକ ସେବାସମୂହ (Public Services)',
    servicesSub: 'ତଳେ ଥିବା ଯେକୌଣସି ସେବା ବାଛନ୍ତୁ କିମ୍ବା AI ସହାୟକଙ୍କ ସହିତ ସିଧାସଳଖ କଥା ହୁଅନ୍ତୁ।',
    howTitle: 'କିପରି ବ୍ୟବହାର କରିବେ? (୩ଟି ସହଜ ସୋପାନ)',
    quickTrackPlaceholder: 'ଟିକେଟ୍ ନମ୍ବର ଲେଖନ୍ତୁ (ଉଦା: GS-ROAD-2026-001001)',
    quickTrackBtn: 'ସ୍ଥିତି ଦେଖନ୍ତୁ',
    cscTitle: 'ନିକଟସ୍ଥ ଜନ ସେବା / ମୋ ସେବା କେନ୍ଦ୍ର (CSC Locator)',
    cscSub: 'ଫର୍ମ ପୂରଣ, ବାୟୋମେଟ୍ରିକ୍ କିମ୍ବା କାଗଜପତ୍ର ସହାୟତା ପାଇଁ ଆପଣଙ୍କ ବ୍ଲକର କେନ୍ଦ୍ର ଖୋଜନ୍ତୁ।',
  },
  hi: {
    heroTitle: 'आपका अधिकार,',
    heroHighlight: 'हमारी सेवा',
    heroSubtitle:
      'ओडिशा के हर नागरिक के लिए AI-संचालित शासन। अपनी भाषा में बोलें या लिखें — सरकारी योजनाएं खोजें और शिकायत दर्ज करें।',
    talkAiBtn: 'GraamSeva AI से बात करें',
    checkSchemeBtn: 'योजना पात्रता जांचें',
    servicesHeading: 'नागरिक सेवाएं (Public Services)',
    servicesSub: 'नीचे दी गई कोई भी सेवा चुनें या सीधे हमारे AI सहायक से पूछें।',
    howTitle: 'कैसे उपयोग करें? (3 आसान चरण)',
    quickTrackPlaceholder: 'टिकट नंबर दर्ज करें (जैसे: GS-ROAD-2026-001001)',
    quickTrackBtn: 'स्थिति जांचें',
    cscTitle: 'नजदीकी जन सेवा / मो सेवा केंद्र (CSC Locator)',
    cscSub: 'दस्तावेज़ और बायोमेट्रिक सहायता के लिए अपने जिले का केंद्र खोजें।',
  },
  en: {
    heroTitle: 'Your Rights,',
    heroHighlight: 'Our Service',
    heroSubtitle:
      'AI-powered governance for every Odia citizen. Speak or type in Odia, Hindi, or English to discover welfare schemes, file complaints, and track resolution.',
    talkAiBtn: 'Talk to GraamSeva AI',
    checkSchemeBtn: 'Check Scheme Eligibility',
    servicesHeading: 'Citizen Public Services',
    servicesSub: 'Choose a service below or ask our AI assistant directly by voice or text.',
    howTitle: 'How GraamSeva AI Works (3 Simple Steps)',
    quickTrackPlaceholder: 'Enter Ticket ID (e.g. GS-ROAD-2026-001001)',
    quickTrackBtn: 'Track Status',
    cscTitle: 'Nearest Jan Seva / Mo Seba Kendra (CSC Locator)',
    cscSub: 'Find your block’s Common Service Centre for in-person document & biometric help.',
  },
}

