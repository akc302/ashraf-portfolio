import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NearbyUser } from '../types';
import { formatDistanceMiles } from '../utils/format';

type Props = {
  user: NearbyUser;
  onPoke: () => void;
  onChat: () => void;
};

export function UserRow({ user, onPoke, onChat }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.meta}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.distance}>{formatDistanceMiles(user.distanceMiles)}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.poke]} onPress={onPoke}>
          <Text style={styles.buttonText}>Poke</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.chat]} onPress={onChat}>
          <Text style={styles.buttonText}>Text</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  meta: { flex: 1 },
  name: { color: 'white', fontSize: 16, fontWeight: '600' },
  distance: { color: '#9ca3af', marginTop: 4 },
  actions: { flexDirection: 'row', gap: 8 },
  button: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  poke: { backgroundColor: '#374151' },
  chat: { backgroundColor: '#2563eb' },
  buttonText: { color: 'white', fontWeight: '600' }
});
