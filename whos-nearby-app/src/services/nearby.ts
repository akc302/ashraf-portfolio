import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { geohashForLocation, geohashQueryBounds, distanceBetween } from 'geofire-common';
import { db } from './firebase';
import type { NearbyUser, RadiusMiles } from '../types';

export async function updateMyPresence(uid: string, name: string, lat: number, lng: number) {
  // In production, use setDoc(doc(db, 'users', uid), ... , { merge: true }) with serverTimestamp.
  // This starter keeps write logic minimal.
  return { uid, name, lat, lng, geohash: geohashForLocation([lat, lng]) };
}

export async function findNearbyUsers(currentUid: string, lat: number, lng: number, radiusMiles: RadiusMiles): Promise<NearbyUser[]> {
  const radiusInM = radiusMiles * 1609.34;
  const bounds = geohashQueryBounds([lat, lng], radiusInM);
  const users: NearbyUser[] = [];

  for (const b of bounds) {
    const q = query(
      collection(db, 'users'),
      where('geohash', '>=', b[0]),
      where('geohash', '<=', b[1]),
      where('online', '==', true),
      limit(75)
    );

    const snap = await getDocs(q);

    snap.forEach((d) => {
      const v = d.data() as { uid: string; name: string; lat: number; lng: number; lastSeenAt?: { toMillis?: () => number } };
      if (v.uid === currentUid) return;

      const distKm = distanceBetween([lat, lng], [v.lat, v.lng]);
      const distMiles = distKm * 0.621371;
      if (distMiles <= radiusMiles) {
        users.push({
          uid: v.uid,
          name: v.name,
          distanceMiles: distMiles,
          lastSeenAt: v.lastSeenAt?.toMillis?.() ?? Date.now()
        });
      }
    });
  }

  const deduped = Array.from(new Map(users.map((u) => [u.uid, u])).values());
  return deduped.sort((a, b) => a.distanceMiles - b.distanceMiles);
}
