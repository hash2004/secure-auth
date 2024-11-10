// secureauth-frontend/src/utils/api.js

import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const signUp = (data) => apiClient.post('/signup', data)
export const verifyOTP = (data) => apiClient.post('/verify-otp', data)
export const login = (data) => apiClient.post('/login', data)

export default apiClient
