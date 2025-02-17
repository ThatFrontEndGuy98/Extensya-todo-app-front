<template>
    <div class="min-h-screen bg-gray-100">


      <div class="p-6">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p class="mt-2 text-gray-600">Manage users and tasks</p>
        </div>
  

        <div class="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div class="p-6 bg-white rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-700">Total Users</h3>
            <p class="text-3xl font-bold text-indigo-600">{{ totalUsers }}</p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-700">Total Tasks</h3>
            <p class="text-3xl font-bold text-indigo-600">{{ totalTasks }}</p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-700">Pending Tasks</h3>
            <p class="text-3xl font-bold text-indigo-600">{{ pendingTasks }}</p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-700">Notifications Sent</h3>
            <p class="text-3xl font-bold text-indigo-600">{{ totalNotifications }}</p>
          </div>
        </div>
  

        <div class="mb-6 border-b border-gray-200">
            <nav class="flex space-x-8">
              <button 
                @click="activeTab = 'users'"
                :class="[
                  'px-4 py-2 font-medium',
                  activeTab === 'users' 
                    ? 'border-b-2 border-indigo-600 text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                Users Management
              </button>
              <button 
                @click="activeTab = 'tasks'"
                :class="[
                  'px-4 py-2 font-medium',
                  activeTab === 'tasks' 
                    ? 'border-b-2 border-indigo-600 text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                Tasks Management
              </button>
              <button 
                @click="activeTab = 'notifications'"
                :class="[
                  'px-4 py-2 font-medium',
                  activeTab === 'notifications' 
                    ? 'border-b-2 border-indigo-600 text-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700'
                ]"
              >
                Notifications
              </button>
            </nav>
          </div>

        <div v-if="activeTab === 'notifications'" class="bg-white rounded-lg shadow">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Send Notifications</h2>
                <button 
                  @click="showNotificationModal = true"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  New Notification
                </button>
              </div>
    

              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Recipient</th>
                      <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Message</th>
                      <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Sent At</th>
                      <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                      <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr v-for="notification in notificationHistory" :key="notification.id">
                      <td class="px-6 py-4 text-sm text-gray-900">{{ notification.recipient_name }}</td>
                      <td class="px-6 py-4 text-sm text-gray-500">{{ notification.message }}</td>
                      <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(notification.created_at) }}</td>
                      <td class="px-6 py-4">
                        <span 
                          :class="[
                            'px-2 py-1 text-xs font-medium rounded-full',
                            notification.read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          ]"
                        >
                          {{ notification.read ? 'Read' : 'Unread' }}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <button 
                          @click="deleteNotification(notification.id)"
                          class="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

      <div v-if="showNotificationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900">Send New Notification</h3>
            <form @submit.prevent="sendNotification" class="mt-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Recipient</label>
                <select 
                  v-model="notificationForm.recipient_id"
                  required
                  class="w-full p-2 text-black border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select User</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Type</label>
                <select 
                  v-model="notificationForm.type"
                  required
                  class="w-full p-2 text-black border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="">Select Option</option>
                  <option value="info">Info.</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Priority</label>
                <select 
                  v-model="notificationForm.priority"
                  required
                  class="w-full p-2 text-black border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="">Select Option</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <input 
                  v-model="notificationForm.title"
                  required
                  rows="4"
                  class="w-full p-2 text-black border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Message</label>
                <textarea 
                  v-model="notificationForm.message"
                  required
                  rows="4"
                  class="w-full p-2 text-black border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div class="flex justify-end space-x-3">
                <button 
                  type="button"
                  @click="closeNotificationModal"
                  class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

        <div v-if="activeTab === 'users'" class="bg-white rounded-lg shadow">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Users List</h2>
              <button 
                @click="showAddUserModal = true"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Add New User
              </button>
            </div>
  

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Admin Status</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="user in users" :key="user.id">
                    <td class="px-6 py-4 text-sm text-gray-900">{{ user.name }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ user.email }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                      <span 
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          user.is_admin ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                        ]"
                      >
                        {{ user.is_admin ? 'Admin' : 'User' }}
                      </span>
                    </td>

                    <td class="px-6 py-4">
                      <button 
                        @click="editUser(user)"
                        class="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        @click="deleteUser(user.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
  

        <div v-if="activeTab === 'tasks'" class="bg-white rounded-lg shadow">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Tasks Overview</h2>
              <div class="flex space-x-4">
                <select 
                  v-model="taskFilter"
                  class="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <button 
                  @click="showAddTaskModal = true"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add New Task
                </button>
              </div>
            </div>
  

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Assigned To</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Due Date</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Priority</th>
                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="task in filteredTasks" :key="task.id">
                    <td class="px-6 py-4 text-sm text-gray-900">{{ task.title }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ task.assignedTo }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ task.dueDate }}</td>
                    <td class="px-6 py-4">
                      <span 
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        ]"
                      >
                        {{ task.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span 
                        :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        ]"
                      >
                        {{ task.priority }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <button 
                        @click="editTask(task)"
                        class="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        @click="deleteTask(task.id)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showAddUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingUser ? 'Edit User' : 'Add New User' }}
            </h3>
            <form @submit.prevent="saveUser" class="mt-4">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  v-model="userForm.name"
                  type="text"
                  class="w-full p-2 text-black border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  v-model="userForm.email"
                  type="email"
                  class="w-full p-2 text-black border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div class="mb-4">
               
                <div class="mt-1">
                  <label class="flex gap-[10px] items-center">
                    <input 
                      type="checkbox" 
                      v-model="userForm.is_admin"
                      class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <label class="block text-sm font-medium text-gray-700">Make Admin?</label>
                  </label>
                </div>
              </div>
              <div class="flex justify-end space-x-3">
                <button 
                  type="button"
                  @click="showAddUserModal = false"
                  class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {{ editingUser ? 'Update' : 'Add' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../components/navbar.vue'


const activeTab = ref('users')
const showAddUserModal = ref(false)
const showAddTaskModal = ref(false)
const showNotificationModal = ref(false)
const editingUser = ref(null)
const editingTask = ref(null)
const loading = ref({
  users: false,
  tasks: false,
  notifications: false,
  action: false
})

const pagination = ref({
  total: 0,
  currentPage: 1,
  lastPage: 1,
  perPage: 10
})

const userForm = ref({
  name: '',
  email: '',
  password: '',
  is_admin: false
})

const taskForm = ref({
  title: '',
  description: '',
  assigned_to: null,
  due_date: '',
  priority: 'medium',
  status: 'pending'
})

const notificationForm = ref({
  recipient_id: '',
  message: '',
  title:'',
  type: '',
  priority:''
})


const users = ref([])
const tasks = ref([])
const notificationHistory = ref([])
const taskFilter = ref('all')

const API_BASE_URL = '/api/v1'


const totalUsers = computed(() => Array.isArray(users.value) ? users.value.length : 0)
const totalTasks = computed(() => Array.isArray(tasks.value) ? tasks.value.length : 0)
const pendingTasks = computed(() => Array.isArray(tasks.value) ? 
  tasks.value.filter(task => task.status === 'pending').length : 0)
const totalNotifications = computed(() => Array.isArray(notificationHistory.value) ? 
  notificationHistory.value.length : 0)

const filteredTasks = computed(() => {
  if (!Array.isArray(tasks.value)) return []
  if (taskFilter.value === 'all') return tasks.value
  return tasks.value.filter(task => task.status === taskFilter.value)
})


const fetchUsers = async () => {
  try {
    loading.value.users = true
    const response = await axios.get(`${API_BASE_URL}/admin/users`)
    users.value = response.data.users.data
    pagination.value = {
      total: response.data.meta.total,
      currentPage: response.data.meta.current_page,
      lastPage: response.data.meta.last_page,
      perPage: response.data.meta.per_page
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value.users = false
  }
}

const createUser = async () => {
  try {
    loading.value.action = true
    const response = await axios.post(`${API_BASE_URL}/admin/users`, userForm.value)
    await fetchUsers()
    closeUserModal()
  } catch (error) {
    console.error('Error creating user:', error)
  } finally {
    loading.value.action = false
  }
}

const updateUser = async () => {
  try {
    loading.value.action = true
    const response = await axios.put(
      `${API_BASE_URL}/admin/users/${editingUser.value.id}`, 
      userForm.value
    )
    await fetchUsers()
    closeUserModal()
  } catch (error) {
    console.error('Error updating user:', error)
  } finally {
    loading.value.action = false
  }
}

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  
  try {
    loading.value.action = true
    await axios.delete(`${API_BASE_URL}/admin/users/${userId}`)
    await fetchUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
  } finally {
    loading.value.action = false
  }
}


const fetchTasks = async () => {
  try {
    loading.value.tasks = true
    const response = await axios.get(`${API_BASE_URL}/admin/tasks`)
    tasks.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching tasks:', error)
  } finally {
    loading.value.tasks = false
  }
}

const createTask = async () => {
  try {
    loading.value.action = true
    await axios.post(`${API_BASE_URL}/admin/tasks`, taskForm.value)
    await fetchTasks()
    closeTaskModal()
  } catch (error) {
    console.error('Error creating task:', error)
  } finally {
    loading.value.action = false
  }
}

const updateTask = async () => {
  try {
    loading.value.action = true
    await axios.put(
      `${API_BASE_URL}/admin/tasks/${editingTask.value.id}`, 
      taskForm.value
    )
    await fetchTasks()
    closeTaskModal()
  } catch (error) {
    console.error('Error updating task:', error)
  } finally {
    loading.value.action = false
  }
}

const deleteTask = async (taskId) => {
  if (!confirm('Are you sure you want to delete this task?')) return
  
  try {
    loading.value.action = true
    await axios.delete(`${API_BASE_URL}/admin/tasks/${taskId}`)
    await fetchTasks()
  } catch (error) {
    console.error('Error deleting task:', error)
  } finally {
    loading.value.action = false
  }
}


const fetchNotificationHistory = async () => {
  try {
    loading.value.notifications = true
    const response = await axios.get(`${API_BASE_URL}/admin/notifications/history`)
    notificationHistory.value = response.data.data || []
  } catch (error) {
    console.error('Error fetching notification history:', error)
  } finally {
    loading.value.notifications = false
  }
}

const sendNotification = async () => {
  try {
    loading.value.action = true
    await axios.post(`${API_BASE_URL}/admin/notifications`, notificationForm.value)
    await fetchNotificationHistory()
    closeNotificationModal()
  } catch (error) {
    console.error('Error sending notification:', error)
  } finally {
    loading.value.action = false
  }
}

const deleteNotification = async (notificationId) => {
  if (!confirm('Are you sure you want to delete this notification?')) return
  
  try {
    loading.value.action = true
    await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`)
    notificationHistory.value = notificationHistory.value.filter(n => n.id !== notificationId)
  } catch (error) {
    console.error('Error deleting notification:', error)
  } finally {
    loading.value.action = false
  }
}


const changePage = async (page) => {
  if (page < 1 || page > pagination.value.lastPage) return
  
  try {
    loading.value.users = true
    const response = await axios.get(`${API_BASE_URL}/admin/users?page=${page}`)
    users.value = response.data.users.data
    pagination.value = {
      total: response.data.meta.total,
      currentPage: response.data.meta.current_page,
      lastPage: response.data.meta.last_page,
      perPage: response.data.meta.per_page
    }
  } catch (error) {
    console.error('Error changing page:', error)
  } finally {
    loading.value.users = false
  }
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    is_admin: Boolean(user.is_admin)
  }
  showAddUserModal.value = true
}

const editTask = (task) => {
  editingTask.value = task
  taskForm.value = {
    title: task.title,
    description: task.description,
    assigned_to: task.assigned_to,
    due_date: task.due_date,
    priority: task.priority,
    status: task.status
  }
  showAddTaskModal.value = true
}

const closeUserModal = () => {
  showAddUserModal.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    password: '',
    is_admin: false
  }
}

const closeTaskModal = () => {
  showAddTaskModal.value = false
  editingTask.value = null
  taskForm.value = {
    title: '',
    description: '',
    assigned_to: null,
    due_date: '',
    priority: 'medium',
    status: 'pending'
  }
}

const closeNotificationModal = () => {
  showNotificationModal.value = false
  notificationForm.value = {
    recipient_id: '',
  message: '',
  title:'',
  type: '',
  priority:''
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

const saveUser = async () => {
  if (editingUser.value) {
    await updateUser()
  } else {
    await createUser()
  }
}

const saveTask = async () => {
  if (editingTask.value) {
    await updateTask()
  } else {
    await createTask()
  }
}


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

onMounted(async () => {
  await Promise.all([
    fetchUsers(),
    fetchTasks(),
    fetchNotificationHistory()
  ])
})

</script>