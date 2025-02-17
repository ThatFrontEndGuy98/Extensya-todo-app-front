import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from './routers/index'


const app = createApp(App);
app.use(router)
const pinia = createPinia()
app.use(pinia)
app.use(PrimeVue);
app.mount('#app')
