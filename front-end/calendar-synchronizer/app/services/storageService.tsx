import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
} as const;

// Secure storage — uses SecureStore on mobile, cookies/localStorage on web
const secureSet = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    // Web: use httpOnly cookies ideally, localStorage as fallback
    localStorage.setItem(key, value);
  } else {
    // iOS/Android: encrypted at OS level
    await SecureStore.setItemAsync(key, value);
  }
};

const secureGet = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return SecureStore.getItemAsync(key);
  }
};

const secureDelete = async (key: string): Promise<void> => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const StorageService = {
  async saveAccessToken(token: string): Promise<void> {
    await secureSet(KEYS.ACCESS_TOKEN, token);
  },

  async getAccessToken(): Promise<string | null> {
    return secureGet(KEYS.ACCESS_TOKEN);
  },

  async saveRefreshToken(token: string): Promise<void> {
    await secureSet(KEYS.REFRESH_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return secureGet(KEYS.REFRESH_TOKEN);
  },

  async saveUserInfo(user: { email: string; givenName: string; familyName: string }): Promise<void> {
    await secureSet(KEYS.USER_INFO, JSON.stringify(user));
  },

  async getUserInfo(): Promise<{ email: string; givenName: string; familyName: string } | null> {
    const data = await secureGet(KEYS.USER_INFO);
    return data ? JSON.parse(data) : null;
  },

  async clearAll(): Promise<void> {
    await secureDelete(KEYS.ACCESS_TOKEN);
    await secureDelete(KEYS.REFRESH_TOKEN);
    await secureDelete(KEYS.USER_INFO);
  },
};