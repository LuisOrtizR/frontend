import axios from 'axios'

const API_URL = 'http://localhost:3000/auth'

export const login = async (email: string, password: string) => {
  const { data } = await axios.post(`${API_URL}/login`, { email, password })
  return data
}

export const register = async (email: string, password: string) => {
  const { data } = await axios.post(`${API_URL}/register`, { email, password })
  return data
}

export const forgotPassword = async (email: string) => {
  const { data } = await axios.post(`${API_URL}/forgot-password`, { email })
  return data
}

export const resetPassword = async (token: string, newPassword: string) => {
  const { data } = await axios.post(`${API_URL}/reset-password`, { token, newPassword })
  return data
}
