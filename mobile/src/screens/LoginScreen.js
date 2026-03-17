import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Allows the in-app browser to close itself after the OAuth redirect
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { loginWithToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handlePress() {
    setLoading(true);
    setError(null);

    try {
      // Open the backend's server-side OAuth flow in a system browser.
      // After Google confirms, the backend issues a JWT and redirects to
      // pillpal://auth?token=<JWT>.  WebBrowser intercepts that deep link
      // and returns it here as result.url.
      const result = await WebBrowser.openAuthSessionAsync(
        `${API_URL}/auth/google/mobile`,
        'pillpal://'
      );

      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const token = url.searchParams.get('token');
        if (token) {
          await loginWithToken(token);
          // Navigation reacts to auth state — no explicit navigate() needed
          return;
        }
      }

      // User cancelled or no token in redirect
      setError('Sign-in was cancelled or failed. Please try again.');
    } catch {
      setError('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Brand */}
        <View style={styles.iconWrap}>
          <Text style={styles.iconText}>💊</Text>
        </View>
        <Text style={styles.title}>PillPal</Text>
        <Text style={styles.subtitle}>Manage your medications with ease</Text>

        {/* Sign-in button */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#4f46e5"
            style={styles.button}
          />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
            activeOpacity={0.85}
          >
            {/* Google "G" mark */}
            <View style={styles.gWrap}>
              <Text style={styles.gText}>G</Text>
            </View>
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </TouchableOpacity>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconText: { fontSize: 30 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 36,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  gWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  gText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  buttonText: { fontSize: 15, fontWeight: '600', color: '#374151' },
  error: {
    marginTop: 16,
    fontSize: 13,
    color: '#ef4444',
    textAlign: 'center',
  },
});
