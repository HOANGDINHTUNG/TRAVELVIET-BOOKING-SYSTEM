import * as SecureStore from 'expo-secure-store';
import type { AuthSession } from '@/services/authStorage';

const SESSION_KEY = 'travelviet.auth.session';

export async function persistSession(session: AuthSession | null) {
  try {
    if (!session?.accessToken) {
      await SecureStore.deleteItemAsync(SESSION_KEY);
      return;
    }
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  } catch {
    // SecureStore không khả dụng (một số môi trường dev) — bỏ qua, vẫn dùng RAM
  }
}

export async function loadPersistedSession(): Promise<AuthSession | null> {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.accessToken) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function clearPersistedSession() {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch {
    // ignore
  }
}
