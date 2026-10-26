import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
