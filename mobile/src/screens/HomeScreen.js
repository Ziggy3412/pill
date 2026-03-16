import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [pills, setPills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPills = useCallback(async () => {
    try {
      const data = await api.get('/api/pills');
      setPills(data);
    } catch {
      // Pills will stay empty — no crash
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchPills(); }, [fetchPills]);

  function onRefresh() {
    setRefreshing(true);
    fetchPills();
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          {user?.photo ? (
            <Image source={{ uri: user.photo }} style={styles.avatar} />
          ) : null}
          <View>
            <Text style={styles.greeting}>Hi, {user?.displayName} 👋</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Medications</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" style={styles.loader} />
      ) : (
        <FlatList
          data={pills}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>💊</Text>
              <Text style={styles.emptyText}>No medications added yet.</Text>
              <Text style={styles.emptyHint}>Add them on the web app and pull to refresh.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.pillCard}>
              <View style={styles.pillHeader}>
                <Text style={styles.pillName}>{item.name}</Text>
                <View style={[styles.urgencyBadge, urgencyColor(item.urgency)]}>
                  <Text style={styles.urgencyText}>★ {item.urgency}</Text>
                </View>
              </View>
              <Text style={styles.pillDetail}>{item.medication} · {item.dosage}</Text>
              {item.notes ? (
                <Text style={styles.pillNotes}>{item.notes}</Text>
              ) : null}
            </View>
          )}
          contentContainerStyle={pills.length === 0 && styles.emptyList}
        />
      )}
    </View>
  );
}

function urgencyColor(level) {
  if (level <= 2) return { backgroundColor: '#dcfce7' };
  if (level === 3) return { backgroundColor: '#fef9c3' };
  return { backgroundColor: '#fee2e2' };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  greeting: { fontSize: 16, fontWeight: '600', color: '#111827' },
  email: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  logoutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  logoutText: { fontSize: 13, color: '#6b7280' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  loader: { marginTop: 60 },
  pillCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pillName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  urgencyBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  urgencyText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  pillDetail: { fontSize: 13, color: '#6b7280' },
  pillNotes: { fontSize: 12, color: '#9ca3af', marginTop: 6, fontStyle: 'italic' },
  emptyList: { flex: 1 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 6 },
  emptyHint: { fontSize: 13, color: '#9ca3af', textAlign: 'center' },
});
