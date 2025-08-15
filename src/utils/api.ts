// src/utils/api.ts
import axios from 'axios';

const instance = axios.create({
  // baseURL: 'https://lms-backend-pi-ten.vercel.app/api',
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  console.log('token from local storage',token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
