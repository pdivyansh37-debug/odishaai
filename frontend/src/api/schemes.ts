import apiClient from './client'

export const getSchemes = async (dept?: string): Promise<any[]> => {
  const response = await apiClient.get('/schemes', { params: { dept } })
  return response.data
}

export const checkEligibility = async (criteria: any): Promise<any> => {
  const response = await apiClient.post('/schemes/check-eligibility', criteria)
  return response.data
}

export const searchSchemes = async (q: string): Promise<any[]> => {
  const response = await apiClient.get('/schemes/search', { params: { q } })
  return response.data
}

export const getSchemeById = async (id: number | string): Promise<any> => {
  const response = await apiClient.get(`/schemes/${id}`)
  return response.data
}
