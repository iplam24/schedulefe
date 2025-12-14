<template>
  <MainLayout>
    <div class="dashboard-container">
      <aside class="sidebar">
        <div class="sidebar-sticky">
          <div class="user-info-group">
            <div class="avatar">{{ user.slice(-2) }}</div>
            <div class="details">
              <h3>{{ user }}</h3>
              <span class="status-tag">● Trực tuyến</span>
            </div>
            <button @click="$emit('logout')" class="btn-mobile-logout">Thoát</button>
          </div>

          <div class="date-selector">
            <label>CHỌN NGÀY XEM LỊCH</label>
            <input type="date" :value="selectedDate" @input="$emit('update:selectedDate', $event.target.value)" class="input-date" />
          </div>

          <div class="sidebar-footer-pc">
            <button @click="$emit('logout')" class="btn-pc-logout">Đăng xuất</button>
          </div>
        </div>
      </aside>

      <main class="content-view">
        <header class="content-header">
          <div class="title-area">
            <span class="label text-green font-bold">LỊCH TRÌNH CHI TIẾT</span>
            <h2>{{ dateFull }}</h2>
          </div>
          <div class="count-badge">{{ data.length }} Môn học</div>
        </header>

        <div class="schedule-grid">
          <div v-for="item in data" :key="item.id" class="lesson-card" @click="$emit('show-detail', item)">
            <div class="lesson-side" :class="item.tietBatDau >= 6 ? 'pm' : 'am'">
              <span class="label-tiet">Tiết</span>
              <span class="range">{{ item.tietBatDau }}-{{ item.tietBatDau + item.soTiet - 1 }}</span>
            </div>
            <div class="lesson-main">
              <div class="top-info">
                <span>{{ item.tietBatDau >= 6 ? 'Chiều' : 'Sáng' }}</span>
                <span>{{ item.maMon }}</span>
              </div>
              <h3 class="name">{{ item.tenMon }}</h3>
              <div class="bottom-info">
                <span class="room">📍 {{ item.phong }}</span>
                <span class="class-code">{{ item.lop }}</span>
              </div>
            </div>
          </div>

          <div v-if="data.length === 0" class="empty-state">
            <div class="empty-icon">☕</div>
            <h3>Hôm nay bạn được nghỉ!</h3>
          </div>
        </div>
      </main>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import MainLayout from '../components/MainLayout.vue';

const props = defineProps(['data', 'user', 'selectedDate']);
const emit = defineEmits(['update:selectedDate', 'logout', 'show-detail']);

const dateFull = computed(() => {
  const d = new Date(props.selectedDate);
  return d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
});
</script>

<style scoped>
.dashboard-container { display: flex; width: 100%; min-height: 100vh; }
.sidebar { width: 320px; background: white; border-right: 1px solid #e2e8f0; flex-shrink: 0; }
.sidebar-sticky { position: sticky; top: 0; padding: 40px 25px; height: 100vh; display: flex; flex-direction: column; box-sizing: border-box; }
.avatar { width: 50px; height: 50px; background: #16a34a; color: white; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; }
.user-info-group { display: flex; align-items: center; gap: 15px; }
.details h3 { margin: 0; font-size: 16px; }
.status-tag { font-size: 11px; color: #16a34a; font-weight: bold; }
.date-selector { margin-top: 40px; flex-grow: 1; }
.input-date { width: 100%; padding: 14px; border: 2px solid #16a34a; border-radius: 12px; font-family: inherit; font-weight: 700; color: #15803d; margin-top: 10px; }

.content-view { flex-grow: 1; padding: 40px; background: #f8fafc; }
.content-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; }
.count-badge { background: #1e293b; color: white; padding: 4px 15px; border-radius: 20px; font-size: 12px; font-weight: 700; }

.schedule-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 24px; }
.lesson-card { display: flex; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); cursor: pointer; transition: 0.3s; }
.lesson-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
.lesson-side { width: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; }
.am { background: linear-gradient(180deg, #f59e0b, #d97706); }
.pm { background: linear-gradient(180deg, #3b82f6, #1d4ed8); }
.lesson-main { flex-grow: 1; padding: 20px; }
.room { background: #f1f5f9; padding: 5px 12px; border-radius: 8px; font-size: 13px; color: #475569; font-weight: bold; }

.btn-mobile-logout { display: none; }
.btn-pc-logout { width: 100%; padding: 12px; border: none; background: #fee2e2; color: #ef4444; border-radius: 10px; font-weight: 700; cursor: pointer; }

@media (max-width: 992px) {
  .dashboard-container { flex-direction: column; }
  .sidebar { width: 100%; height: auto; border-right: none; border-bottom: 1px solid #e2e8f0; }
  .sidebar-sticky { height: auto; padding: 20px; position: static; flex-direction: row; align-items: center; justify-content: space-between; }
  .btn-mobile-logout { display: block; background: #fee2e2; color: #ef4444; border: none; padding: 8px 12px; border-radius: 8px; font-weight: 700; }
  .sidebar-footer-pc { display: none; }
  .date-selector { margin-top: 0; max-width: 200px; }
  .schedule-grid { grid-template-columns: 1fr; }
  .content-view { padding: 20px; }
}
</style>