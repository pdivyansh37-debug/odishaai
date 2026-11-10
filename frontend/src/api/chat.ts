import apiClient from './client'

export interface ChatResponse {
  response: string
  intent: string
  language?: string
  matched_schemes?: any[]
  ticket_id?: string
  suggestions?: string[]
}

export const sendChatMessage = async (
  message: string,
  language: string = 'odia',
  sessionId: string = 'default'
): Promise<ChatResponse> => {
  const response = await apiClient.post('/chat', {
    message,
    language,
    session_id: sessionId,
  })
  return response.data
}

export const sendMessage = sendChatMessage

export const sendVoiceMessage = async (
  audioBlob: Blob,
  sessionId: string = 'default',
  language: string = 'odia'
): Promise<ChatResponse> => {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')
  formData.append('session_id', sessionId)
  formData.append('language', language)

  const response = await apiClient.post('/chat/voice', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}
