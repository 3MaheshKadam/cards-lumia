import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { CONFIG } from '../config';

const API_URL = CONFIG.API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      // Potentially clear token
      // We should probably rely on the UI/Context to handle the logout to avoid circular deps
      // But clearing the token here is safe.
      await SecureStore.deleteItemAsync('userToken');
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password, plan = 'SILVER') => api.post('/auth/signup', { username, email, password, plan }),
  getProfile: () => api.get('/users/me'),
};

export const groups = {
  create: (data) => api.post('/groups', data),
  list: () => api.get('/groups'),
  get: (id) => api.get(`/groups/${id}`),
  join: (id) => api.post(`/groups/${id}/join`),
  messages: (id) => api.get(`/groups/${id}/messages`),
};

export const cards = {
  add: (data) => api.post('/cards', data),
  list: () => api.get('/cards'),
};

export const auctions = {
  create: (data) => api.post('/auctions', data),
  list: () => api.get('/auctions'),
  get: (id) => api.get(`/auctions/${id}`),
  bid: (id, amount) => api.post(`/auctions/${id}/bid`, { amount }),
};

export const orders = {
  list: () => api.get('/orders'),
  pay: (id) => api.post(`/orders/${id}/pay`),
  ship: (id) => api.post(`/orders/${id}/ship`),
  deliver: (id) => api.post(`/orders/${id}/deliver`),
};

export default api;
