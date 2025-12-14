import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'


const app = createApp(App)

app.use(createPinia()) // Kích hoạt Pinia để dùng store
app.use(router)        // Kích hoạt Router để chuyển trang

app.mount('#app')