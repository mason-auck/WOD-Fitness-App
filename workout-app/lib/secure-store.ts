import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * SecureStore values are capped (~2048 bytes). Auth sessions can exceed that,
 * so large values are stored in chunks. On web, localStorage is used instead.
 */
const CHUNK_SIZE = 1800;

function chunkKey(key: string, index: number) {
  return `${key}_chunk_${index}`;
}

async function nativeSetItem(key: string, value: string) {
  const chunkCount = Math.ceil(value.length / CHUNK_SIZE);

  if (chunkCount <= 1) {
    await SecureStore.setItemAsync(key, value);
    await SecureStore.deleteItemAsync(chunkKey(key, 0)).catch(() => undefined);
    return;
  }

  await SecureStore.deleteItemAsync(key).catch(() => undefined);

  for (let i = 0; i < chunkCount; i++) {
    const chunk = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    await SecureStore.setItemAsync(chunkKey(key, i), chunk);
  }

  // Store count so we know how many chunks to read back.
  await SecureStore.setItemAsync(key, `chunked:${chunkCount}`);
}

async function nativeGetItem(key: string) {
  const value = await SecureStore.getItemAsync(key);
  if (!value) {
    return null;
  }

  if (!value.startsWith("chunked:")) {
    return value;
  }

  const chunkCount = Number(value.replace("chunked:", ""));
  if (!Number.isFinite(chunkCount) || chunkCount <= 0) {
    return null;
  }

  let combined = "";
  for (let i = 0; i < chunkCount; i++) {
    const chunk = await SecureStore.getItemAsync(chunkKey(key, i));
    if (chunk == null) {
      return null;
    }
    combined += chunk;
  }
  return combined;
}

async function nativeRemoveItem(key: string) {
  const value = await SecureStore.getItemAsync(key);

  if (value?.startsWith("chunked:")) {
    const chunkCount = Number(value.replace("chunked:", ""));
    for (let i = 0; i < chunkCount; i++) {
      await SecureStore.deleteItemAsync(chunkKey(key, i)).catch(() => undefined);
    }
  }

  await SecureStore.deleteItemAsync(key).catch(() => undefined);
  await SecureStore.deleteItemAsync(chunkKey(key, 0)).catch(() => undefined);
}

/** Supabase auth storage adapter (SecureStore on native). */
export const secureAuthStorage = {
  async getItem(key: string) {
    if (Platform.OS === "web") {
      return globalThis.localStorage?.getItem(key) ?? null;
    }
    return nativeGetItem(key);
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === "web") {
      globalThis.localStorage?.setItem(key, value);
      return;
    }
    await nativeSetItem(key, value);
  },
  async removeItem(key: string) {
    if (Platform.OS === "web") {
      globalThis.localStorage?.removeItem(key);
      return;
    }
    await nativeRemoveItem(key);
  },
};
