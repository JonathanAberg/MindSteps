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

export const updateSession = async (id: string, data: any) => {
  const res = await api.put(`/sessions/${id}`, data);
  return res.data;
};

// Bulk delete helper (iterativ om backend saknar särskilt endpoint)
export const deleteAllSessionsForDevice = async (deviceId: string) => {
  try {
    // Försök med direkt endpoint om backend stödjer det
    // (om inte existerar kommer den kasta och vi faller tillbaka)
    const direct = await api.delete(`/sessions?deviceId=${deviceId}`).catch(() => null);
    if (direct) return direct.data;
  } catch {
    // ignore – fallback nedan tar över
  }
  // Fallback: hämta och radera en-i-taget
  const list = await fetchSessions(deviceId);
  for (const s of list) {
    try {
      await deleteSession(s._id);
    } catch {
      /* fortsätt med nästa */
    }
  }
  return { deleted: list.length };
};