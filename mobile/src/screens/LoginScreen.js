import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';

// Allows the in-app browser to close itself after the OAuth redirect
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    // Each platform needs its own OAuth 2.0 Client ID from Google Cloud Console.
    // The web client ID is also used for Expo Go during development.
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
  });

  // React to the OAuth response once the browser closes
  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        handleLogin(idToken);
      } else {
        setError('Could not retrieve ID token from Google.');
        setLoading(false);
      }
    } else if (response.type === 'error') {
      setError('Google sign-in failed. Please try again.');
      setLoading(false);
    } else if (response.type === 'cancel' || response.type === 'dismiss') {
      setLoading(false);
    }
  }, [response]);

  async function handleLogin(idToken) {
    try {
      setError(null);
      await login(idToken);
      // Navigation reacts to auth state — no explicit navigate() needed
    } catch {
      setError('Sign-in failed. Please try again.');
      setLoading(false);
    }
  }

  function handlePress() {
    setLoading(true);
    setError(null);
    promptAsync();
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
            style={[styles.button, !request && styles.buttonDisabled]}
            onPress={handlePress}
            disabled={!request}
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
  buttonDisabled: { opacity: 0.5 },
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
