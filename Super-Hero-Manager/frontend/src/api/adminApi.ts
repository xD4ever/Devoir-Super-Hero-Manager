import axios from 'axios';
import { User } from '../types/User';
import { resolveApiUrl } from '../config';

export interface AuditEntry {
  _id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
}

const API_URL = resolveApiUrl('/api/admin');

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fallback demo data if /api/admin is not implemented
const fallbackUsers: User[] = [
  { _id: '1', username: 'admin', role: 'admin' },
  { _id: '2', username: 'editor', role: 'editor' },
];

const fallbackAudit: AuditEntry[] = [
  {
    _id: '1',
    actor: 'admin',
    action: 'CREATED_HERO',
    target: 'Spider-Man',
    createdAt: new Date().toISOString(),
  },
];

export const fetchUsers = async (): Promise<{
  data: User[];
  fallback: boolean;
}> => {
  let fallback = false;
  try {
    const res = await axios.get<User[]>(`${API_URL}/users`, {
      headers: authHeaders(),
    });
    return { data: res.data, fallback };
  } catch (e) {
    console.warn('API /admin/users unavailable, using fallback data');
    fallback = true;
    return { data: fallbackUsers, fallback };
  }
};

export const fetchAuditLog = async (): Promise<{
  data: AuditEntry[];
  fallback: boolean;
}> => {
  let fallback = false;
  try {
    const res = await axios.get<AuditEntry[]>(`${API_URL}/audit`, {
      headers: authHeaders(),
    });
    return { data: res.data, fallback };
  } catch (e) {
    console.warn('API /admin/audit unavailable, using fallback data');
    fallback = true;
    return { data: fallbackAudit, fallback };
  }
};
