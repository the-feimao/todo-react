import axios from 'axios';
import { getToken } from './storage';

const api = axios.create({
  baseURL: 'http://10.0.2.2:8000/api', // change to your dev host accessible to device
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// attach token for each request
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
