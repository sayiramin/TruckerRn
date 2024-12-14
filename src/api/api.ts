import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL of your Laravel API server
const API_BASE_URL = 'http://127.0.0.1:8002/api';

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from AsyncStorage as bearer token on every request
instance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
