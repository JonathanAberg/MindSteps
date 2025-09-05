import { CreateSessionProps } from '../../types/sessionProps';
import apiClient from '../api/client';

const api = apiClient;

export const fetchSessions = async (deviceId: string) => {
  const response = await api.get(`/sessions?deviceId=${deviceId}`);
  return response.data;
};

export const createSession = async (sessionData: CreateSessionProps) => {
  const response = await api.post('/sessions/start', sessionData);
  return response.data;
};

export const fetchSessionById = async (id: string) => {
  try {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching session with ID ${id}:`, error);
    throw new Error('Failed to fetch session.');
  }
};

export const deleteSession = async (id: string) => {
  try {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting session with ID ${id}:`, error);
    throw new Error('Failed to delete session.');
  }
};
