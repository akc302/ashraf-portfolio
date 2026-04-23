# Who's Nearby?

A cross-platform (iOS + Android) **text-only local chat app** where users can:

- Sign in
- See other users around them (walkable distance)
- Send a quick **poke**
- Start **text chat only** (no voice, no images)

## Recommended stack

- **App:** React Native + Expo + TypeScript
- **Auth + Database + Realtime:** Firebase (Auth + Firestore)
- **Location:** Expo Location API
- **Nearby search:** Geohash index + radius filtering

This starter includes a simple architecture and core files for MVP.

---

## MVP flow

1. User signs in with display name.
2. App asks for location permission.
3. App updates user location in Firestore every ~20–30 seconds (or on movement).
4. App fetches nearby users by selected radius:
   - Few feet (~0.1 miles)
   - 0.5 miles
   - 1 mile
   - 3 miles
5. User can:
   - Poke someone nearby
   - Open text chat room with that user

---

## Data model (Firestore)

### `users/{uid}`

```ts
{
  uid: string;
  name: string;
  lat: number;
  lng: number;
  geohash: string;
  lastSeenAt: Timestamp;
  online: boolean;
}
```

### `pokes/{pokeId}`

```ts
{
  fromUid: string;
  toUid: string;
  createdAt: Timestamp;
}
```

### `chats/{chatId}`

```ts
{
  members: [uidA, uidB];
  updatedAt: Timestamp;
}
```

### `chats/{chatId}/messages/{messageId}`

```ts
{
  senderUid: string;
  text: string;
  createdAt: Timestamp;
}
```

---

## Security rules (important)

- Allow reading users only if they are online and recently active.
- Allow messages only if requester is chat member.
- Enforce max message length (for moderation and cost control).
- Add rate-limits via Cloud Functions (anti-spam pokes/messages).

---

## Privacy & safety recommendations

- Use **approximate distance**, not exact location.
- Hide exact coordinates from client-side UI.
- Auto-expire stale online status (e.g., inactive > 3 minutes).
- Add block/report user actions in next version.

---

## Run locally (Expo)

1. Install dependencies

```bash
npm install
```

2. Add Firebase config in `src/services/firebase.ts`.

3. Start app

```bash
npm run start
```

Then open in iOS Simulator / Android Emulator / Expo Go.
