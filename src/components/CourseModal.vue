<template>
  <transition name="fade">
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-card" @click.stop>
        <div class="modal-header" :class="course.tietBatDau >= 6 ? 'afternoon-bg' : 'morning-bg'">
          <div class="header-info">
            <span class="badge">CHI TIẾT MÔN HỌC</span>
            <h3>{{ course.tenMon }}</h3>
          </div>
          <button class="close-x" @click="$emit('close')">&times;</button>
        </div>

        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <label>Mã học phần</label>
              <p>{{ course.maMon }}</p>
            </div>
            <div class="detail-item">
              <label>Số tín chỉ</label>
              <p>{{ course.soTinChi }} tín chỉ</p>
            </div>
            <div class="detail-item">
              <label>Giảng viên</label>
              <p>{{ course.giangVien || 'Chưa cập nhật' }}</p>
            </div>
            <div class="detail-item">
              <label>Phòng học</label>
              <p class="text-green font-bold">📍 {{ course.phong }}</p>
            </div>
            <div class="detail-item">
              <label>Lớp học</label>
              <p>{{ course.lop }}</p>
            </div>
            <div class="detail-item">
              <label>Nhóm / Tổ</label>
              <p>Nhóm {{ course.nhom }} - Tổ {{ course.toNhom || 'X' }}</p>
            </div>
            <div class="detail-item">
              <label>Thời gian</label>
              <p>Thứ {{ course.thu === 8 ? 'CN' : course.thu }}, Tiết {{ course.tietBatDau }} - {{ course.tietBatDau + course.soTiet - 1 }}</p>
            </div>
            <div class="detail-item border-none">
              <label>Tuần học</label>
              <p>Tuần thứ {{ course.tuanSo }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-done" @click="$emit('close')">Đã rõ</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  course: {
    type: Object,
    required: true
  }
});
defineEmits(['close']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  padding: 30px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.morning-bg { background: linear-gradient(135deg, #f59e0b, #d97706); }
.afternoon-bg { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }

.badge {
  font-size: 10px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: inline-block;
}

.header-info h3 { margin: 0; font-size: 20px; font-weight: 800; line-height: 1.4; }

.close-x {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body { padding: 25px; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.detail-item label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  display: block;
  margin-bottom: 4px;
}

.detail-item p { margin: 0; font-size: 14px; font-weight: 700; color: #1e293b; }
.text-green { color: #10b981; }
.font-bold { font-weight: 800; }

.modal-footer { padding: 0 25px 25px; }
.btn-done {
  width: 100%;
  padding: 14px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
}

.btn-done:hover { background: #059669; transform: translateY(-2px); }

@media (max-width: 600px) {
  .detail-grid { grid-template-columns: 1fr; gap: 15px; }
  .modal-card { border-radius: 20px; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>