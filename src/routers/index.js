// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import authService from '../services/auth'
import { useAdminStore } from '../stores/adminStore'
import Login from '../views/login.vue'
import Register from '../views/register.vue'
import UserDashboard from '../views/userDashboard.vue'
import AdminDashboard from '../views/adminDashboard.vue'
import Task from '../views/task.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { 
      requiresGuest: true 
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { 
      requiresGuest: true 
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: UserDashboard,
    meta: { 
      requiresAuth: true 
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: Task,
    meta: { 
      requiresAuth: true 
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to, from, next) => {
  const adminStore = useAdminStore()
  const isAuthenticated = adminStore.isAuthenticated
  

  console.log('Route guard check:', {
    path: to.path,
    isAuthenticated,
    isAdmin: adminStore.getIsAdmin,
    requiresAuth: to.meta.requiresAuth,
    requiresAdmin: to.meta.requiresAdmin,
    requiresGuest: to.meta.requiresGuest
  })


  if (to.meta.requiresGuest && isAuthenticated) {
    console.log('Authenticated user trying to access guest route')
    return next('/dashboard')
  }


  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Unauthenticated user trying to access protected route')
    return next({
      name: 'login',
      query: { redirect: to.fullPath }
    })
  }


  if (isAuthenticated && !adminStore.user) {
    try {
      console.log('Initializing admin state...')
      await adminStore.initializeAdmin()
    } catch (error) {
      console.error('Failed to initialize admin state:', error)
      authService.logout()
      return next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    }
  }


  if (to.meta.requiresAdmin && !adminStore.getIsAdmin) {
    console.log('Non-admin user trying to access admin route')
    return next('/dashboard')
  }

  next()
})


import axios from 'axios'

axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const adminStore = useAdminStore()
      authService.logout()
      adminStore.clearAdminState()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default router