import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

export const analyzeText = async (text) => {
  const { data } = await api.post('/analyze', { text });
  return data;
};

export const getHealth = async () => {
  const { data } = await api.get('/health');
  return data;
};
