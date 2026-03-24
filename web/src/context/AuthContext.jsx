import { createContext, useContext, useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true while we're checking the existing session on first load
  const [loading, setLoading] = useState(true);

  // On mount, restore from localStorage instantly — no network call needed
  useEffect(() => {
    const token = localStorage.getItem('pillpal_token');
    const savedUser = localStorage.getItem('pillpal_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('pillpal_user');
        localStorage.removeItem('pillpal_token');
      }
    }
    setLoading(false);
  }, []);

  async function login(credential) {
    const res = await fetch(`${API}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ credential }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    if (data.token) localStorage.setItem('pillpal_token', data.token);
    if (data.user) localStorage.setItem('pillpal_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    localStorage.removeItem('pillpal_token');
    localStorage.removeItem('pillpal_user');
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
