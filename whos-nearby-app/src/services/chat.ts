export async function sendPoke(fromUid: string, toUid: string) {
  // TODO: write a Firestore document in /pokes collection.
  return { ok: true, fromUid, toUid, sentAt: Date.now() };
}

export async function sendMessage(chatId: string, senderUid: string, text: string) {
  const clean = text.trim().slice(0, 400);
  if (!clean) throw new Error('Message cannot be empty.');

  // TODO: write a Firestore document in /chats/{chatId}/messages collection.
  return { ok: true, chatId, senderUid, text: clean, sentAt: Date.now() };
}
