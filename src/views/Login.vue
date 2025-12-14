<template>
  <div class="login-screen">
    <div class="login-card shadow-animation">
      <div class="login-header">
        <div class="icon-box">🌿</div>
        <h1>GREEN HUB</h1>
        <p>Đăng nhập để đồng bộ lịch học</p>
      </div>
      <div class="form-group">
        <input v-model="form.mssv" type="text" placeholder="Mã số sinh viên" />
        <input v-model="form.password" type="password" placeholder="Mật khẩu Portal" />
        <button @click="handleLogin" :disabled="loading" class="btn-login">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'ĐANG ĐỒNG BỘ...' : 'ĐĂNG NHẬP' }}
        </button>
        <p class="login-note">Lưu ý: Lần đầu đồng bộ có thể mất 5-10 giây.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { timetableApi } from '../api/timetable';

const emit = defineEmits(['login-success']);
const loading = ref(false);
const form = reactive({ mssv: '', password: '' });

const handleLogin = async () => {
  if (!form.mssv || !form.password) return alert('Nhập thiếu thông tin!');
  loading.value = true;
  try {
    const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
    const lastCrawl = localStorage.getItem(`last_crawl_${form.mssv}`);
    
    if (!lastCrawl || (Date.now() - parseInt(lastCrawl)) > THREE_DAYS) {
      await timetableApi.refresh(form.mssv, form.password);
      localStorage.setItem(`last_crawl_${form.mssv}`, Date.now().toString());
    }
    
    const res = await timetableApi.get(form.mssv);
    localStorage.setItem('user_session', form.mssv);
    emit('login-success', res.data, form.mssv);
  } catch (e) {
    alert('Lỗi đăng nhập hoặc đồng bộ!');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-screen { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f0fdf4; padding: 20px; }
.login-card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 380px; text-align: center; }
.icon-box { font-size: 50px; margin-bottom: 10px; }
.btn-login { background: #16a34a; color: white; border: none; padding: 14px; border-radius: 12px; width: 100%; font-weight: 700; cursor: pointer; margin-top: 15px; }
input { width: 100%; padding: 12px; margin-bottom: 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; box-sizing: border-box; }
.login-note { font-size: 11px; color: #94a3b8; margin-top: 15px; }
@keyframes slideUp { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.shadow-animation { animation: slideUp 0.4s ease-out; }
.spinner { width: 14px; height: 14px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 1s infinite linear; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>