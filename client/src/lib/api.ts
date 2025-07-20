const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    throw new Error(data.error || data.message || 'API Error');
  }
  return data as T;
} 