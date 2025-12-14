<template>
  <div class="app-container">
    <transition name="fade">
      <div v-if="loading" class="global-loading-overlay">
        <div class="loading-content shadow-animation">
          <div class="big-spinner"></div>
          <h3>Đang đồng bộ dữ liệu...</h3>
          <p class="loading-note">
            Chạy lần đầu có thể khá chậm vì "kí sinh" lên trang Đào tạo, <br/>
            mong các bạn thông cảm! 🌿
          </p>
        </div>
      </div>
    </transition>

    <header class="global-nav shadow-sm">
      <div class="nav-content">
        <div class="brand">
          <div class="logo-box">🌿</div>
          <span class="brand-text">VNUA CALENDAR</span>
        </div>
        <div class="nav-actions">
          <div v-if="isLoggedIn" class="user-meta">
            <span class="mssv-badge">SV: {{ currentUser }}</span>
            <button @click="logout" class="btn-logout-top">Đăng xuất</button>
          </div>
          <span v-else class="version">v2.8</span>
        </div>
      </div>
    </header>

    <main class="main-body">
      <div v-if="!isLoggedIn && !showSemesterSelect" class="view-login">
        <div class="login-card shadow-animation">
          <div class="login-head">
            <h2>Chào mừng bạn!</h2>
            <p>Nhập MSSV để xem lịch hoặc đồng bộ mới</p>
          </div>
          <transition name="fade">
            <div v-if="errorMessage" class="error-banner"><span>⚠️</span> {{ errorMessage }}</div>
          </transition>
          <div class="form">
            <div class="input-wrap">
              <label>Mã số sinh viên</label>
              <input v-model="loginForm.mssv" type="text" placeholder="67xxxx" @input="errorMessage = ''" />
            </div>
            <div class="input-wrap">
              <label>Mật khẩu  </label>
              <input v-model="loginForm.password" type="password" placeholder="••••••••" @input="errorMessage = ''" />
            </div>
            <div class="login-options">
              <button @click="handleLogin(false)" :disabled="loading" class="btn-primary-submit">
                XEM LỊCH ĐÃ LƯU
              </button>
              <div class="divider"><span>HOẶC</span></div>
              <button @click="handleLogin(true)" :disabled="loading" class="btn-sync-outline">
                ĐỒNG BỘ LỊCH MỚI
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="showSemesterSelect" class="view-login">
        <div class="login-card shadow-animation">
          <div class="login-head">
            <h2>Đồng bộ học kỳ</h2>
            <p>Chọn kỳ học bạn muốn lấy dữ liệu</p>
          </div>
          <div class="form">
            <div class="input-wrap">
              <label>Học kỳ khả dụng</label>
              <select v-model="selectedSemester" class="date-picker" style="width: 100%; background: #fff; height: 45px;">
                <option disabled value="">-- Vui lòng chọn học kỳ --</option>
                <option v-for="sem in semesterList" :key="sem" :value="sem">{{ sem }}</option>
              </select>
            </div>
            <button @click="handleRefreshData" :disabled="loading || !selectedSemester" class="btn-primary-submit">
              BẮT ĐẦU ĐỒNG BỘ
            </button>
            <button @click="showSemesterSelect = false" class="btn-back">Quay lại</button>
          </div>
        </div>
      </div>

      <div v-else class="view-dashboard">
        <aside class="dashboard-sidebar">
          <div class="sidebar-inner">
            <div class="sidebar-section">
              <label class="sidebar-label">CHỌN NGÀY XEM LỊCH</label>
              <input type="date" v-model="selectedDate" class="date-picker" />
            </div>
            <!-- <div class="sidebar-section" style="margin-top: 20px;">
              <button @click="goToSyncAgain" class="btn-sync-mini">🔄 Đồng bộ kỳ khác</button>
            </div> -->
            <div class="sidebar-status desktop-only">
              <p>Trạng thái: <span class="text-green font-bold">Máy chủ sẵn sàng</span></p>
              <p>Đồng bộ: {{ lastUpdateDisplay }}</p>
            </div>
          </div>
        </aside>

        <section class="schedule-area">
          <div class="schedule-header">
            <div class="header-titles">
              <span class="label-mini text-green">LỊCH TRÌNH CHI TIẾT</span>
              <p v-if="isOldSemester" style="font-size: 11px; color: #f59e0b; margin: 0; font-weight: 700;">
                ⚠️ Đang xem kỳ học cũ (Hiển thị từ ngày bắt đầu)
              </p>
              <h2>{{ formatDateFull(selectedDate) }}</h2>
            </div>
            <div class="count-pill" v-if="filteredSchedule.length >= 0">{{ filteredSchedule.length }} môn học</div>
          </div>

          <div class="schedule-content">
            <div v-if="filteredSchedule.length > 0" class="schedule-grid">
              <div v-for="item in filteredSchedule" :key="item.id" class="lesson-card shadow-animation" @click="selectedLesson = item">
                <div class="lesson-stripe" :class="item.tietBatDau >= 6 ? 'pm' : 'am'">
                  <span class="stripe-period">TIẾT</span>
                  <span class="stripe-range">{{ item.tietBatDau }}-{{ item.tietBatDau + item.soTiet - 1 }}</span>
                </div>
                <div class="lesson-body">
                  <div class="body-top">
                    <span class="tag-buoi">{{ item.tietBatDau >= 6 ? 'Chiều' : 'Sáng' }}</span>
                    <span class="tag-ma">{{ item.maMon }}</span>
                  </div>
                  <h3 class="course-name">{{ item.tenMon }}</h3>
                  <div class="body-bot">
                    <span class="room-pill">📍 {{ item.phong }}</span>
                    <span class="class-id">{{ item.lop }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state shadow-animation">
              <div class="empty-icon">🌿</div>
              <h3>Không có lịch học</h3>
              <p>Hãy tận hưởng thời gian nghỉ ngơi nhé!</p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <footer class="global-footer">
      <div class="footer-wrap">
        <p>© 2025 By Vũ Xuân Lâm đẹp trai.</p>
        <div class="footer-links desktop-only"><span>Hướng dẫn</span><span>Bảo mật</span></div>
      </div>
    </footer>

    <transition name="fade">
      <div v-if="selectedLesson" class="modal-overlay" @click="selectedLesson = null">
        <div class="modal-box shadow-animation" @click.stop>
          <div class="modal-header" :class="selectedLesson.tietBatDau >= 6 ? 'pm-bg' : 'am-bg'">
            <div class="header-text">
              <span class="badge-mini">THÔNG TIN CHI TIẾT</span>
              <h3>{{ selectedLesson.maMon }}</h3>
            </div>
            <button @click="selectedLesson = null" class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="info-grid">
              <div class="info-cell"><strong>Tín chỉ:</strong> {{ selectedLesson.soTinChi }} Tín</div>
              <div class="info-cell"><strong>Nhóm:</strong> {{ selectedLesson.nhom }}</div>
              <div class="info-cell"><strong>Giảng viên:</strong> {{ selectedLesson.giangVien || 'Chưa cập nhật' }}</div>
              <div class="info-cell"><strong>Lớp học:</strong> {{ selectedLesson.lop }}</div>
              <div class="info-cell"><strong>Phòng học:</strong> <span class="text-green font-bold">📍 {{ selectedLesson.phong }}</span></div>
              <div class="info-cell"><strong>Thứ học:</strong> {{ selectedLesson.thu === 8 ? 'Chủ Nhật' : 'Thứ ' + selectedLesson.thu }}</div>
              <div class="info-cell"><strong>Tiết học:</strong> Tiết {{ selectedLesson.tietBatDau }} ({{ selectedLesson.soTiet }} tiết)</div>
              <div class="info-cell"><strong>Tuần thứ:</strong> {{ selectedLesson.tuanSo }}</div>
            </div>
            <div class="info-full">
              <label>Tên học phần:</label>
              <h4>{{ selectedLesson.tenMon }}</h4>
            </div>
          </div>
          <button @click="selectedLesson = null" class="btn-modal-close">ĐÃ HIỂU</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://tesst-3rg0pw.fly.dev/api';
const loading = ref(false);
const isSyncMode = ref(false);
const isLoggedIn = ref(false);
const showSemesterSelect = ref(false);
const isOldSemester = ref(false);
const currentUser = ref('');
const timetable = ref([]);
const semesterList = ref([]);
const selectedSemester = ref('');
const errorMessage = ref('');
const loginForm = reactive({ mssv: '', password: '' });
const selectedLesson = ref(null);

const getTodayVN = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const selectedDate = ref(getTodayVN());

const setSmartDate = (semStart) => {
  const todayStr = getTodayVN();
  const today = new Date(todayStr);
  const start = new Date(semStart);
  const end = new Date(semStart);
  end.setMonth(end.getMonth() + 5);

  if (today >= start && today <= end) {
    selectedDate.value = todayStr;
    isOldSemester.value = false;
  } else {
    selectedDate.value = semStart;
    isOldSemester.value = true;
  }
};

const filteredSchedule = computed(() => {
  if (!timetable.value) return [];
  return timetable.value.filter(item => item.date === selectedDate.value);
});

const lastUpdateDisplay = computed(() => {
  const ts = localStorage.getItem(`sync_${currentUser.value}`);
  return ts ? new Date(parseInt(ts)).toLocaleString('vi-VN') : 'Chưa rõ';
});

const formatDateFull = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
};

const handleLogin = async (isSyncAction) => {
  if (!loginForm.mssv) { errorMessage.value = "Vui lòng nhập MSSV!"; return; }
  loading.value = true;
  isSyncMode.value = isSyncAction;
  errorMessage.value = '';

  try {
    if (isSyncAction) {
      if (!loginForm.password) { errorMessage.value = "Cần mật khẩu !"; loading.value = false; return; }
      const res = await axios.post(`${API_BASE}/tkb/fetch-semesters`, loginForm);
      if (res.data.success) {
        semesterList.value = res.data.data;
        currentUser.value = loginForm.mssv;
        showSemesterSelect.value = true;
      } else { errorMessage.value = res.data.message; }
    } else {
      const res = await axios.get(`${API_BASE}/tkb/${loginForm.mssv}`);
      if (res.data.data && res.data.data.length > 0) {
        timetable.value = res.data.data;
        currentUser.value = loginForm.mssv;
        isLoggedIn.value = true;
        localStorage.setItem('user_session', loginForm.mssv);
        const savedStart = localStorage.getItem(`sem_start_${loginForm.mssv}`);
        if (savedStart) setSmartDate(savedStart);
      } else { errorMessage.value = "Chưa có dữ liệu, hãy Đồng bộ!"; }
    }
  } catch (e) {
    errorMessage.value = "Lỗi kết nối hoặc thông tin sai!";
  } finally {
    loading.value = false;
  }
};

const handleRefreshData = async () => {
  loading.value = true;
  try {
    const res = await axios.post(`${API_BASE}/tkb/refresh`, {
      mssv: currentUser.value,
      selectedSemester: selectedSemester.value
    });
    if (res.data.success) {
      const { semesterStart, timetable: dataList } = res.data.data;
      timetable.value = dataList;
      setSmartDate(semesterStart);
      isLoggedIn.value = true;
      showSemesterSelect.value = false;
      localStorage.setItem('user_session', currentUser.value);
      localStorage.setItem(`sync_${currentUser.value}`, Date.now().toString());
      localStorage.setItem(`sem_start_${currentUser.value}`, semesterStart);
    }
  } catch (e) {
    errorMessage.value = "Lỗi khi đồng bộ dữ liệu!";
  } finally {
    loading.value = false;
  }
};

const goToSyncAgain = () => {
  isLoggedIn.value = false;
  showSemesterSelect.value = false;
};

const logout = () => {
  isLoggedIn.value = false;
  currentUser.value = '';
  localStorage.removeItem('user_session');
};

const openDetail = (item) => { selectedLesson.value = item; };

onMounted(async () => {
  const s = localStorage.getItem('user_session');
  if (s) {
    currentUser.value = s;
    isLoggedIn.value = true;
    try {
      const res = await axios.get(`${API_BASE}/tkb/${s}`);
      timetable.value = res.data.data;
      const savedStart = localStorage.getItem(`sem_start_${s}`);
      if (savedStart) setSmartDate(savedStart);
    } catch (e) { logout(); }
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

/* --- GLOBAL LOADING OVERLAY (CẢI TIẾN) --- */
.global-loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loading-content {
  padding: 40px;
}

.big-spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #10b981;
  border-radius: 50%;
  animation: spin 1s infinite linear;
  margin: 0 auto 25px;
}

.loading-content h3 {
  font-size: 20px;
  font-weight: 800;
  color: #064e3b;
  margin-bottom: 12px;
}

.loading-note {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  font-weight: 600;
}

/* --- CƠ BẢN --- */
.app-container { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; width: 100%; }
.main-body { flex: 1; display: flex; flex-direction: column; width: 100%; }
.text-green { color: #10b981 !important; }
.font-bold { font-weight: 700; }

.global-nav { background: white; border-bottom: 1px solid #e2e8f0; height: 60px; display: flex; align-items: center; position: sticky; top: 0; z-index: 1000; width: 100%; }
.nav-content { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; }
.brand { display: flex; align-items: center; gap: 10px; }
.logo-box { background: #10b981; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.brand-text { font-weight: 800; color: #064e3b; font-size: 16px; }
.user-meta { display: flex; align-items: center; gap: 12px; }
.mssv-badge { font-size: 12px; font-weight: 700; background: #f0fdf4; color: #16a34a; padding: 4px 10px; border-radius: 6px; }
.btn-logout-top { background: #fee2e2; color: #dc2626; border: none; padding: 5px 12px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer; }

.view-login { flex: 1; display: flex; align-items: center; justify-content: center; padding: 20px; background: #f0fdf4; }
.login-card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 380px; text-align: center; }
.login-head h2 { margin-bottom: 8px; font-weight: 800; }
.login-head p { color: #64748b; font-size: 13px; margin-bottom: 25px; }
.error-banner { background: #fef2f2; color: #dc2626; padding: 10px; border-radius: 10px; margin-bottom: 15px; font-size: 12px; font-weight: 700; border: 1px solid #fee2e2; }
.input-wrap { text-align: left; margin-bottom: 15px; }
.input-wrap label { display: block; font-size: 11px; font-weight: 800; color: #94a3b8; margin-bottom: 5px; margin-left: 4px; }
.input-wrap input { width: 100%; padding: 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; box-sizing: border-box; font-family: inherit; font-weight: 600; outline: none; }
.btn-primary-submit { width: 100%; padding: 14px; background: #10b981; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; margin-top: 10px; }

.view-dashboard { display: flex; width: 100%; max-width: 1400px; margin: 0 auto; flex: 1; }
.dashboard-sidebar { width: 260px; background: white; border-right: 1px solid #e2e8f0; flex-shrink: 0; }
.sidebar-inner { position: sticky; top: 60px; padding: 30px 20px; height: calc(100vh - 60px); box-sizing: border-box; display: flex; flex-direction: column; }
.sidebar-label { font-size: 10px; font-weight: 800; color: #94a3b8; letter-spacing: 1px; display: block; margin-bottom: 10px; }
.date-picker { width: 100%; padding: 8px 10px; border: 2px solid #10b981; border-radius: 8px; font-family: inherit; font-weight: 700; font-size: 13px; color: #065f46; outline: none; box-sizing: border-box; }

.login-options { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
.divider { position: relative; text-align: center; margin: 15px 0; }
.divider::before { content: ""; position: absolute; top: 50%; left: 0; width: 100%; height: 1px; background: #e2e8f0; z-index: 1; }
.divider span { position: relative; z-index: 2; background: white; padding: 0 15px; font-size: 10px; font-weight: 800; color: #94a3b8; }
.btn-sync-outline { width: 100%; padding: 12px; background: white; color: #10b981; border: 2.5px solid #10b981; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s; }
.btn-sync-mini { width: 100%; padding: 10px; background: #f0fdf4; color: #059669; border: 1px dashed #10b981; border-radius: 8px; font-weight: 700; font-size: 11px; cursor: pointer; }
.btn-back { background: none; border: none; color: #94a3b8; font-size: 12px; font-weight: 700; text-decoration: underline; margin-top: 15px; cursor: pointer; }
.sidebar-status { margin-top: auto; padding-top: 15px; border-top: 1px solid #f1f5f9; font-size: 11px; color: #64748b; line-height: 1.6; }

.schedule-area { flex: 1; padding: 40px; background: #f8fafc; min-width: 0; }
.schedule-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px; }
.label-mini { font-size: 10px; font-weight: 800; letter-spacing: 1px; }
.schedule-header h2 { margin: 5px 0 0; font-size: 22px; font-weight: 800; }
.count-pill { background: #1e293b; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }

.schedule-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
.lesson-card { display: flex; background: white; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.03); cursor: pointer; transition: 0.3s; border: 1px solid #f1f5f9; }
.lesson-card:hover { transform: translateY(-5px); border-color: #10b981; box-shadow: 0 10px 20px rgba(0,0,0,0.06); }
.lesson-stripe { width: 70px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; padding: 10px; flex-shrink: 0; }
.am { background: linear-gradient(180deg, #f59e0b, #d97706); }
.pm { background: linear-gradient(180deg, #3b82f6, #1d4ed8); }
.stripe-range { font-size: 16px; font-weight: 800; }
.lesson-body { flex: 1; padding: 15px 20px; display: flex; flex-direction: column; justify-content: center; }
.course-name { margin: 0; font-size: 14px; font-weight: 800; color: #1e293b; line-height: 1.4; height: 38px; overflow: hidden; }
.room-pill { background: #f1f5f9; padding: 4px 10px; border-radius: 6px; font-size: 11px; color: #475569; }

.empty-state { text-align: center; padding: 60px; background: white; border-radius: 24px; color: #94a3b8; }
.empty-icon { font-size: 40px; margin-bottom: 10px; }

.global-footer { background: white; border-top: 1px solid #e2e8f0; padding: 20px 0; width: 100%; flex-shrink: 0; }
.footer-wrap { max-width: 1400px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; }
.footer-wrap p { font-size: 11px; color: #94a3b8; margin: 0; }
.footer-links { display: flex; gap: 20px; }
.footer-links span { font-size: 11px; font-weight: 700; color: #64748b; }
/* --- MODAL FIX (ĐẢM BẢO CHUẨN ĐẸP) --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5); /* Làm tối nền */
  backdrop-filter: blur(4px);    /* Làm mờ nền */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;                /* Thấp hơn Loading Overlay (9999) một chút */
  padding: 20px;
}

.modal-box {
  background: white;
  width: 100%;
  max-width: 500px;             /* Tăng nhẹ độ rộng */
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 25px 30px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 30px;
  max-height: 70vh;            /* Giới hạn chiều cao để không bị tràn màn hình mobile */
  overflow-y: auto;            /* Tự động hiện scroll nếu nội dung quá dài */
}

/* Grid thông tin chi tiết */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Chia 2 cột */
  gap: 20px;
  margin-bottom: 25px;
}

.info-cell {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 1.5px dashed #f1f5f9;
  padding-bottom: 8px;
  display: flex;
  flex-direction: column;      /* Đưa nhãn lên trên giá trị */
}

.info-cell strong {
  color: #94a3b8;
  font-size: 11px;
  text-transform: uppercase;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

/* Tên môn học hiển thị to và rõ */
.info-full {
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
}

.info-full label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 800;
  display: block;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.info-full h4 {
  margin: 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.5;
}

.btn-modal-close {
  width: 100%;
  padding: 18px;
  border: none;
  background: #f8fafc;
  color: #64748b;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
  border-top: 1px solid #f1f5f9;
}

.btn-modal-close:hover {
  background: #f1f5f9;
  color: #1e293b;
}/* Nút X đóng Modal */
.modal-close {
  background: rgba(255, 255, 255, 0.2); /* Nền trắng mờ */
  border: none;
  color: white;
  font-size: 20px;            /* Kích thước chữ X */
  font-weight: bold;
  cursor: pointer;
  border-radius: 50%;         /* Bo tròn nút */
  width: 34px;                /* Chiều rộng nút */
  height: 34px;               /* Chiều cao nút */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  line-height: 1;
  padding: 0;
  margin: 0;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.4); /* Sáng hơn khi di chuột vào */
  transform: rotate(90deg);            /* Hiệu ứng xoay nhẹ */
}

/* Đảm bảo header modal chứa nút X đúng vị trí */
.modal-header {
  padding: 20px 25px;
  color: white;
  display: flex;
  justify-content: space-between; /* Đẩy tiêu đề sang trái, nút X sang phải */
  align-items: center;            /* Căn giữa theo chiều dọc */
}

/* Responsive cho Mobile */
@media (max-width: 480px) {
  .info-grid {
    grid-template-columns: 1fr; /* Mobile hiện 1 cột cho thoáng */
    gap: 12px;
  }
  
  .modal-box {
    max-height: 90vh;
  }
}
.am-bg { background: linear-gradient(135deg, #f59e0b, #d97706); }
.pm-bg { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.btn-modal-close { width: 100%; padding: 15px; border: none; background: #10b981; color: white; font-weight: 800; cursor: pointer; }

@media (max-width: 992px) {
  .view-dashboard { flex-direction: column; }
  .dashboard-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #e2e8f0; }
  .sidebar-inner { height: auto; padding: 15px 20px; position: static; flex-direction: row; align-items: center; justify-content: space-between; gap: 20px; }
  .desktop-only { display: none; }
  .schedule-area { padding: 20px; }
  .schedule-grid { grid-template-columns: 1fr; }
  .footer-wrap { flex-direction: column; text-align: center; gap: 10px; }
}

@keyframes spin { to { transform: rotate(360deg); } }
.shadow-animation { animation: slideUp 0.4s ease-out; }
@keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>