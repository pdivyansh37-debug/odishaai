export interface Scheme {
  id: string
  name_odia: string
  name_english: string
  department: string
  description: string
  benefits: string[]
  eligibility: EligibilityCriteria
  documents_required: string[]
  apply_link?: string
  deadline?: string
}

export interface EligibilityCriteria {
  min_age?: number
  max_age?: number
  max_income?: number
  caste?: string[]
  occupation?: string[]
  land_ownership?: boolean
  gender?: string
}

export interface EligibilityRequest {
  age: number
  income: number
  caste: string
  land_acres: number
  occupation: string
  gender: string
}

export interface Grievance {
  id: string
  ticket_id: string
  citizen_name: string
  citizen_phone: string
  description: string
  category: GrievanceCategory
  department: string
  district: string
  gps_lat?: number
  gps_lng?: number
  status: GrievanceStatus
  image_url?: string
  ai_summary?: string
  ai_draft_reply?: string
  assigned_to?: string
  created_at: string
  updated_at: string
  resolved_at?: string
  sla_deadline: string
  timeline: TimelineEvent[]
}

export type GrievanceCategory =
  | 'road'
  | 'water'
  | 'electricity'
  | 'health'
  | 'education'
  | 'agriculture'
  | 'housing'
  | 'pension'
  | 'ration'
  | 'other'

export type GrievanceStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'overdue'
  | 'escalated'

export interface TimelineEvent {
  step: string
  timestamp: string
  description: string
  status: 'done' | 'current' | 'pending'
}

export interface Officer {
  id: string
  name: string
  email: string
  department: string
  district: string
  role: 'admin' | 'officer'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  intent?: string
  schemes?: Scheme[]
  ticket_id?: string
  language?: string
}

export interface DashboardStats {
  total: number
  pending: number
  in_progress: number
  resolved: number
  overdue: number
  escalated: number
  avg_resolution_hours: number
  satisfaction_score: number
}

export interface HeatmapPoint {
  lat: number
  lng: number
  ticket_id: string
  category: GrievanceCategory
  status: GrievanceStatus
  description: string
  district: string
}

export interface GrievanceFilters {
  status?: GrievanceStatus
  category?: GrievanceCategory
  district?: string
  date_from?: string
  date_to?: string
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface GrievanceFormData {
  citizen_name: string
  citizen_phone: string
  description: string
  district: string
  gps_lat?: number
  gps_lng?: number
  language?: string
}

export type Language = 'or' | 'hi' | 'en'

export interface LanguageOption {
  code: Language
  label: string
  nativeLabel: string
  flag: string
}
