import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api';

export const timetableApi = {
  refresh: (mssv, password) => axios.post(`${BASE_URL}/tkb/refresh`, { mssv, password }),
  get: (mssv) => axios.get(`${BASE_URL}/tkb/${mssv}`)
};