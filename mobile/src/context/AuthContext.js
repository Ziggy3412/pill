import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const JWT_KEY = 'pillpal_jwt';
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const AuthContext = createContext(null);

// Decode the JWT payload without verifying the signature.
// Signature verification happens server-side on every protected request.
function decodeJwt(token) {
  try {
    const [, payload] = token.split('.');
    // JWT uses URL-safe base64 (no padding) — restore standard base64
    const padded = payload + '==='.slice(0, (4 - (payload.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function isExpired(payload) {
  return Boolean(payload?.exp && Date.now() >= payload.exp * 1000);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session from SecureStore
  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync(JWT_KEY);
        if (token) {
          const payload = decodeJwt(token);
          if (payload && !isExpired(payload)) {
            const { iat, exp, ...userData } = payload;
            setUser(userData);
          } else {
            await SecureStore.deleteItemAsync(JWT_KEY);
          }
        }
      } catch {
        // SecureStore unavailable in some environments — silently skip
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Called with the Google ID token from expo-auth-session
  async function login(idToken) {
    const res = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: idToken }),
    });
    if (!res.ok) throw new Error('Login failed');

    const data = await res.json();
    await SecureStore.setItemAsync(JWT_KEY, data.token);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      const token = await SecureStore.getItemAsync(JWT_KEY);
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await SecureStore.deleteItemAsync(JWT_KEY);
    } catch {
      // best-effort logout
    }
    setUser(null);
  }

  // Convenience for API calls — returns the stored token or null
  async function getToken() {
    try {
      return await SecureStore.getItemAsync(JWT_KEY);
    } catch {
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
