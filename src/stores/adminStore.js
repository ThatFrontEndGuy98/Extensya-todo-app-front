
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    isAdmin: false,
    user: null,
    token: localStorage.getItem('token') || null,
    adminPermissions: []
  }),

  getters: {
    getIsAdmin: (state) => state.isAdmin,
    getUser: (state) => state.user,
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async initializeAdmin() {
      try {
        if (this.token) {
          const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
          const url = `${baseURL}/api/v1/user/profile`
          console.log('Making profile request to:', url)
          
          const response = await axios.get(url, {
            headers: { 
              'Authorization': `Bearer ${this.token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          
          console.log('Profile response:', response.data)
          
          if (response.data && response.data.user) {
            this.user = response.data.user
            this.isAdmin = Boolean(response.data.user.is_admin)
            console.log('Updated admin state:', { 
              isAdmin: this.isAdmin, 
              user: this.user 
            })
          } else {
            console.error('Invalid profile response structure:', response.data)
            throw new Error('Invalid profile response')
          }
        }
      } catch (error) {
        console.error('Initialize admin error:', error.response?.data || error)
        this.clearAdminState()
        throw error
      }
    },

    async login(credentials) {
      try {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        const response = await axios.post(`${baseURL}/api/v1/auth/login`, credentials)
        
        this.token = response.data.token
        localStorage.setItem('token', this.token)
        await this.initializeAdmin()
        
        return response.data
      } catch (error) {
        console.error('Login error:', error.response?.data || error)
        this.clearAdminState()
        throw error
      }
    },

    clearAdminState() {
      this.isAdmin = false
      this.user = null
      this.token = null
      this.adminPermissions = []
      localStorage.removeItem('token')
    }
  }
})