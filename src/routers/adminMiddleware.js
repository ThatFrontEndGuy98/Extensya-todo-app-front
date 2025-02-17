
import { useAdminStore } from '../stores/adminStore'

export const adminMiddleware = async (to, from, next) => {
  const adminStore = useAdminStore()
  
  console.log('Admin middleware check:', {
    isAuthenticated: adminStore.isAuthenticated,
    isAdmin: adminStore.getIsAdmin,
    user: adminStore.user,
    route: to.fullPath
  })
  

  if (!adminStore.isAuthenticated) {
    console.log('Not authenticated, redirecting to login')
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }
  
  try {

    if (!adminStore.user) {
      console.log('Initializing admin state...')
      await adminStore.initializeAdmin()
    }
    
    if (!adminStore.getIsAdmin) {
      console.log('User is not admin:', adminStore.user)
      throw new Error('Unauthorized - Not an admin')
    }
    
    console.log('Admin check passed, proceeding to route')
    next()
  } catch (error) {
    console.error('Admin middleware error:', error.message)
    next({ name: 'unauthorized' })
  }
}