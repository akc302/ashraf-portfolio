import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { UserRow } from '../components/UserRow';
import { getCurrentLocation } from '../services/location';
import { findNearbyUsers } from '../services/nearby';
import { sendPoke } from '../services/chat';
import type { NearbyUser, RadiusMiles } from '../types';

const RADII: RadiusMiles[] = [0.1, 0.5, 1, 3];

export function NearbyScreen() {
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState<RadiusMiles>(0.5);
  const [users, setUsers] = useState<NearbyUser[]>([]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: replace hardcoded UID/name with Firebase auth user.
      const me = { uid: 'demo-user', name: 'You' };
      const coords = await getCurrentLocation();
      const results = await findNearbyUsers(me.uid, coords.lat, coords.lng, radius);
      setUsers(results);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not load nearby users.');
    } finally {
      setLoading(false);
    }
  }, [radius]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const radiusLabel = useMemo(() => `${radius} mile${radius > 1 ? 's' : ''}`, [radius]);

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>Showing people within {radiusLabel}</Text>

      <View style={styles.radiusRow}>
        {RADII.map((r) => (
          <Pressable key={r} onPress={() => setRadius(r)} style={[styles.radiusBtn, radius === r && styles.radiusBtnActive]}>
            <Text style={styles.radiusText}>{r} mi</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.refreshBtn} onPress={refresh}>
        <Text style={styles.refreshText}>Refresh nearby users</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator color="white" style={{ marginTop: 22 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {users.length === 0 ? (
            <Text style={styles.empty}>No users found nearby. Try a wider distance.</Text>
          ) : (
            users.map((u) => (
              <UserRow
                key={u.uid}
                user={u}
                onPoke={async () => {
                  await sendPoke('demo-user', u.uid);
                  Alert.alert('Poke sent', `You poked ${u.name}`);
                }}
                onChat={() => Alert.alert('Start chat', `Open text chat with ${u.name}`)}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0f172a' },
  caption: { color: '#cbd5e1', marginBottom: 10 },
  radiusRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  radiusBtn: { borderWidth: 1, borderColor: '#334155', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  radiusBtnActive: { backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' },
  radiusText: { color: 'white', fontWeight: '600' },
  refreshBtn: { backgroundColor: '#2563eb', borderRadius: 10, padding: 12, marginBottom: 14, alignItems: 'center' },
  refreshText: { color: 'white', fontWeight: '700' },
  empty: { color: '#94a3b8', marginTop: 12 }
});
