
<script setup>
    import { useRoute } from 'vue-router';
import { onMounted } from 'vue'
import { useAdminStore } from './stores/adminStore'

const adminStore = useAdminStore()

onMounted(async () => {
  if (adminStore.token) {
    try {
      await adminStore.initializeAdmin()
    } catch (error) {
      console.error('Failed to initialize admin state:', error)
    }
  }
})
</script>
<template>

    <router-view></router-view>


</template>

<style scoped>

</style>
