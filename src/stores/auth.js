import { defineStore } from 'pinia';
import apiClient from '../api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    terms: [],
    timetable: [],
    loading: false
  }),
  actions: {
    async login(credentials) {
      try {
        const res = await apiClient.post('/api/v1/auth/login', credentials);
        if (res.data.success) {
          const data = res.data.data;
          this.user = data;
          localStorage.setItem('access_token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
          return true;
        }
        return false;
      } catch (e) { return false; }
    },
    async fetchTerms() {
      const res = await apiClient.get('/api/v1/timeable/terms');
      this.terms = res.data.data;
    },
    async fetchSchedule(termCode) {
      this.loading = true;
      try {
        const res = await apiClient.post('/api/v1/timeable/schedule', { termCode });
        this.timetable = res.data.data.timeableList;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = null;
      localStorage.clear();
    }
  }
});