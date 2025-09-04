import axios from 'axios';
import Constants from 'expo-constants';

type Extra = { API_URL?: string };
const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

const BASE_URL = extra.API_URL ?? 'http://192.168.0.89:3000';
// Debug log removed to satisfy eslint no-console rule. If needed, reintroduce via a logger utility.

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export default apiClient;

//API-client = vägen mellan frontend och backend.
//Den håller reda på adressen (t.ex. din IP) och reglerna för hur vi skickar brev (JSON, headers).
//Sedan skickar frontend sina ”anrop” längs den vägen, och backend svarar med data.

//Den hämtar din ip från den .env-fil som du skapade i roten av projektet.
