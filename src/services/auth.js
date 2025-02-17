
import axios from 'axios'
import { useAdminStore } from '../stores/adminStore'
const API_URL = 'http://localhost:8000/api/v1'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

const authService = {
  async login(credentials) {
    console.log('Login service called with:', credentials)  
    try {
      const response = await apiClient.post('/login', credentials)
      console.log('Login response:', response.data)  
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      }
      return response.data
    } catch (error) {
      console.error('Login error:', error.response?.data || error)  
      throw error.response?.data || error
    }
  },

  async register(userData) {
    try {
      const response = await apiClient.post('/register', userData)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      }
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete apiClient.defaults.headers.common['Authorization']
    const adminStore = useAdminStore()
    adminStore.clearAdminState()
  },

  getCurrentUser() {
    const adminStore = useAdminStore()
    return adminStore.user
  },

  getToken() {
    const adminStore = useAdminStore()
    return adminStore.token
  }
}

export default authService