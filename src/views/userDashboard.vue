
<template>
    <Navbar/>
    <div class="min-h-screen mt-5 p-4">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Welcome to Your Dashboard</h1>
        <p class="text-gray-600 mt-2">Manage your tasks and stay organized</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-gray-700">Total Tasks</h3>
          <p class="text-3xl font-bold text-blue-600 mt-2">{{ totalTasks }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-gray-700">Completed</h3>
          <p class="text-3xl font-bold text-green-600 mt-2">{{ completedTasks }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h3 class="text-lg font-semibold text-gray-700">Pending</h3>
          <p class="text-3xl font-bold text-orange-600 mt-2">{{ pendingTasks }}</p>
        </div>
      </div>
  
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Your Tasks</h2>
          <button 
            @click="showNewTaskModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Task
          </button>
        </div>
        <div class="flex gap-4 mb-6">
          <button 
            v-for="filter in filters" 
            :key="filter.value"
            @click="currentFilter = filter.value"
            class="px-4 py-2 rounded-lg"
            :class="[
              currentFilter === filter.value 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>
        <div v-if="filteredTasks.length" class="space-y-4">
          <div 
            v-for="task in filteredTasks" 
            :key="task.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-4">
              <input 
                type="checkbox" 
                :checked="task.status === 'completed'"
                @change="toggleTaskStatus(task.id)"
                class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              >
              <div>
                <p class="text-black" :class="{'line-through text-gray-500': task.status === 'completed'}">
                  {{ task.title }}
                </p>
                <div class="flex items-center gap-2 text-sm">
                  <span class="text-gray-600">Due: {{ formatDate(task.due_date) }}</span>
                  <span 
                    class="px-2 py-0.5 rounded-full text-xs"
                    :class="{
                      'bg-red-100 text-red-700': task.priority === 'high',
                      'bg-yellow-100 text-yellow-700': task.priority === 'medium',
                      'bg-blue-100 text-blue-700': task.priority === 'low'
                    }"
                  >
                    {{ task.priority }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex gap-2">
              <button 
                @click="editTask(task)"
                class="text-gray-600 hover:text-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button 
                @click="deleteTask(task.id)"
                class="text-gray-600 hover:text-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500">
          No tasks found for the selected filter
        </div>
      </div>
  
      <div v-if="showNewTaskModal" class="fixed inset-0 bg-[#000000c4] bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-xl font-semibold mb-4">{{ editingTask ? 'Edit Task' : 'New Task' }}</h3>
          <form @submit.prevent="handleTaskSubmit" class="space-y-4">
            <div>
              <label class="block text-gray-700 mb-2">Title</label>
              <input 
                v-model="taskForm.title"
                type="text"
                required
                class="w-full p-2 text-black border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
              >
            </div>
            
            <div>
              <label class="block text-gray-700 mb-2">Description</label>
              <textarea 
                v-model="taskForm.description"
                rows="3"
                class="w-full p-2 text-black border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task description"
              ></textarea>
            </div>
            
            <div>
              <label class="block text-gray-700 mb-2">Due Date</label>
              <input 
                v-model="taskForm.due_date"
                type="date"
                required
                class="w-full p-2 text-black border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
    
            <div>
              <label class="block text-gray-700 mb-2">Priority</label>
              <select 
                v-model="taskForm.priority"
                required
                class="w-full p-2 text-black border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
    
            <div class="flex justify-end gap-4 mt-6">
              <button 
                type="button"
                @click="closeTaskModal"
                class="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {{ editingTask ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/navbar.vue'

const tasks = ref([])
const showNewTaskModal = ref(false)
const editingTask = ref(null)
const currentFilter = ref('all')

const taskForm = ref({
  title: '',
  description: '',
  due_date: '',
  priority: 'medium'
})

const filters = [
  { label: 'All Tasks', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' }
]
const closeTaskModal = () => {
  showNewTaskModal.value = false
  editingTask.value = null
  resetTaskForm()
}

const resetTaskForm = () => {
  taskForm.value = {
    title: '',
    description: '',
    due_date: '',
    priority: 'medium'
  }
}

const handleTaskSubmit = async () => {
  try {
    if (editingTask.value) {
      await axios.put(`${baseURL}/tasks/${editingTask.value.id}`, taskForm.value)
    } else {
      await axios.post(`${baseURL}/tasks`, taskForm.value)
    }
    await fetchTasks()
    closeTaskModal()
  } catch (error) {
    console.error('Error submitting task:', error)
  }
}

const editTask = (task) => {
  editingTask.value = task
  taskForm.value = {
    title: task.title,
    description: task.description || '',
    due_date: task.due_date,
    priority: task.priority || 'medium'
  }
  showNewTaskModal.value = true
}

const filteredTasks = computed(() => {
  if (!Array.isArray(tasks.value)) return []
  
  switch (currentFilter.value) {
    case 'pending':
      return tasks.value.filter(task => task && task.status === 'pending')
    case 'completed':
      return tasks.value.filter(task => task && task.status === 'completed')
    case 'all':
    default:
      return tasks.value
  }
})

const totalTasks = computed(() => 
  Array.isArray(tasks.value) ? tasks.value.length : 0
)

const completedTasks = computed(() => 
  Array.isArray(tasks.value) ? tasks.value.filter(task => task && task.status === 'completed').length : 0
)

const pendingTasks = computed(() => 
  Array.isArray(tasks.value) ? tasks.value.filter(task => task && task.status === 'pending').length : 0
)

const API_VERSION = 'v1'
const baseURL = `/api/${API_VERSION}`

axios.defaults.baseURL = 'http://127.0.0.1:8000'
axios.defaults.headers.common = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const fetchTasks = async () => {
  try {
    const response = await axios.get(`${baseURL}/tasks`)
    tasks.value = response.data?.data || []
  } catch (error) {
    console.error('Error fetching tasks:', error)
    tasks.value = []
  }
}

const toggleTaskStatus = async (taskId) => {
  try {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return
    
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    await axios.patch(`${baseURL}/tasks/${taskId}/status`, {
      status: newStatus
    })
    await fetchTasks() 
  } catch (error) {
    console.error('Error toggling task status:', error)
  }
}

const deleteTask = async (taskId) => {
  if (!confirm('Are you sure you want to delete this task?')) return
  
  try {
    await axios.delete(`${baseURL}/tasks/${taskId}`)
    await fetchTasks() 
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}

const formatDate = (date) => {
  if (!date) return 'No due date'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchTasks()
})
</script>