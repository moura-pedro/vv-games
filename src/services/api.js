const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  async fetchSessions() {
    const response = await fetch(`${API_BASE_URL}/sessions`);
    if (!response.ok) throw new Error('Failed to fetch sessions');
    return response.json();
  },

  async createSession(session) {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });
    if (!response.ok) throw new Error('Failed to create session');
    return response.json();
  },

  async updateSession(session) {
    const response = await fetch(`${API_BASE_URL}/sessions/${session.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });
    if (!response.ok) throw new Error('Failed to update session');
    return response.json();
  },

  async deleteSession(sessionId) {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete session');
  },
};