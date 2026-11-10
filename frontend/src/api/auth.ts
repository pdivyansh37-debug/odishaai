import apiClient from './client'

export interface LoginResponse {
  access_token: string
  token_type: string
  officer_id: number
  officer_name: string
  role: string
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data
}

export const getMe = async (): Promise<any> => {
  const response = await apiClient.get('/auth/me')
  return response.data
}
