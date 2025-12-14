import { defineStore } from 'pinia';
import apiClient from '../api/axios';

export const useTkbStore = defineStore('tkb', {
  state: () => ({
    timetableRaw: [],
    loading: false,
    mssv: localStorage.getItem('mssv') || '',
    lastSync: localStorage.getItem('last_sync') || 0,
  }),
  getters: {
    // Kiểm tra xem dữ liệu đã quá 3 ngày chưa
    isExpired: (state) => {
      if (!state.lastSync) return true;
      const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
      return (new Date().getTime() - state.lastSync) > threeDaysInMs;
    },
    groupedByWeek: (state) => {
      if (!Array.isArray(state.timetableRaw)) return {};
      const weeks = {};
      state.timetableRaw.forEach(item => {
        const week = item.tuanSo;
        if (!weeks[week]) weeks[week] = [];
        // Chuyển Thứ 8 thành Chủ Nhật
        const displayThu = item.thu === 8 ? "Chủ Nhật" : `Thứ ${item.thu}`;
        weeks[week].push({ ...item, displayThu });
      });
      return weeks;
    }
  },
  actions: {
    async fetchFromDb(mssv) {
      if (!mssv) return;
      this.loading = true;
      try {
        const res = await apiClient.get(`/api/tkb/${mssv}`);
        this.timetableRaw = res.data.data || [];
        this.mssv = mssv;
        localStorage.setItem('mssv', mssv);
      } finally {
        this.loading = false;
      }
    },
    async refreshData(password) {
      if (!this.mssv || !password) return false;
      this.loading = true;
      try {
        const res = await apiClient.post('/api/tkb/refresh', { mssv: this.mssv, password });
        if (res.status === 200) {
          const now = new Date().getTime();
          this.lastSync = now;
          localStorage.setItem('last_sync', now);
          await this.fetchFromDb(this.mssv);
          return true;
        }
      } catch (e) {
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});