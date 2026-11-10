import apiClient from './client'

export const fileGrievance = async (formData: FormData): Promise<any> => {
  const response = await apiClient.post('/grievances', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}

export const trackGrievance = async (ticketId: string): Promise<any> => {
  const response = await apiClient.get(`/grievances/ticket/${ticketId}`)
  return response.data
}

export const getGrievances = async (params: any = {}): Promise<any[]> => {
  const response = await apiClient.get('/grievances', { params })
  return response.data
}

export const updateGrievanceStatus = async (
  id: number | string,
  status: string,
  remark?: string
): Promise<any> => {
  const response = await apiClient.put(`/grievances/${id}/status`, {
    status,
    remark,
  })
  return response.data
}

export const getHeatmapData = async (): Promise<any[]> => {
  const response = await apiClient.get('/grievances/heatmap')
  return response.data
}

export const getDashboardStats = async (): Promise<any> => {
  const response = await apiClient.get('/dashboard/stats')
  return response.data
}
