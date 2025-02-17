<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  const router = useRouter()
  const route = useRoute()
  const isMenuOpen = ref(false)
  const isAuthenticated = ref(false)
  const currentRoute = computed(() => route.path)
  onMounted(() => {
    checkAuthStatus()
  })
  
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token')
    isAuthenticated.value = !!token
  }
  
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    isAuthenticated.value = false
    router.push('/login')
  }
  </script>

<template>
    <nav class="bg-white border-b border-gray-200 w-full z-50">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <router-link to="/" class="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span class="self-center text-2xl font-semibold whitespace-nowrap">TodoApp</span>
        </router-link>
  
        <button
          @click="toggleMenu"
          type="button"
          class="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <svg
            class="w-5 h-5"
            :class="{ 'hidden': isMenuOpen, 'block': !isMenuOpen }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            class="w-5 h-5"
            :class="{ 'block': isMenuOpen, 'hidden': !isMenuOpen }"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
  
       
        <div
          :class="{ 'hidden': !isMenuOpen }"
          class="w-full md:block md:w-auto"
          id="navbar-default"
        >
          <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">

            <template v-if="isAuthenticated">
              <li>
                <router-link 
                  to="/dashboard" 
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                  :class="{ 'text-blue-700': currentRoute === '/dashboard' }"
                >
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/tasks" 
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                  :class="{ 'text-blue-700': currentRoute === '/tasks' }"
                >
                  Tasks
                </router-link>
              </li>
              <li>
                <button 
                  @click="handleLogout" 
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                >
                  Logout
                </button>
              </li>
            </template>
            
            <template v-else>
              <li>
                <router-link 
                  to="/login" 
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                  :class="{ 'text-blue-700': currentRoute === '/login' }"
                >
                  Login
                </router-link>
              </li>
              <li>
                <router-link 
                  to="/register" 
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                  :class="{ 'text-blue-700': currentRoute === '/register' }"
                >
                  Register
                </router-link>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  