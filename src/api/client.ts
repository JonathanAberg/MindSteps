import axios from 'axios';
import Constants from 'expo-constants';

type Extra = { API_URL?: string };
const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

const BASE_URL = extra.API_URL ?? 'http://192.168.0.89:3000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export default apiClient;
