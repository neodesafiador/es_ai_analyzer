import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ES分析API
export const analyzeES = async (data) => {
  const response = await api.post('/es/analyze', data);
  return response.data;
};

// ES履歴取得API
export const getESHistory = async (skip = 0, limit = 50) => {
  const response = await api.get('/es/history', {
    params: { skip, limit }
  });
  return response.data;
};

// ES詳細取得API
export const getESDetail = async (entryId) => {
  const response = await api.get(`/es/${entryId}`);
  return response.data;
};

export default api;
