import { ref } from 'vue'

export function useToast() {
  const toast = ref(null)
  
  const showToast = (message, type = 'success') => {
  //TODO: implement Toast
    console.log(`${type}: ${message}`)
  }
  
  return {
    toast,
    showToast
  }
}