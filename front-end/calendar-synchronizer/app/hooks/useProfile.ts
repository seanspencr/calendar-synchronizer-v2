import { useState, useCallback } from 'react';
import type { UserProfileDto } from '../components/profile/types';

/** Dummy profile data simulating an API response */
const DUMMY_PROFILE: UserProfileDto = {
  id: 'usr-001',
  username: 'Alexander Vance',
  email: 'alexander.vance@gmail.com',
  google_email: 'alexander.vance@gmail.com',
  microsoft_email: null,
  avatarUrl: null,
};

export interface UseProfileReturn {
  profile: UserProfileDto | null;
  isLoading: boolean;
  error: string | null;
  /** Simulate binding a Google account */
  bindGoogle: () => void;
  /** Simulate binding a Microsoft account */
  bindMicrosoft: () => void;
}

/**
 * Dummy hook for fetching the current user's profile.
 * Replace with real API integration using UsersApi.
 */
export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfileDto | null>(DUMMY_PROFILE);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const bindGoogle = useCallback(() => {
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, google_email: prev.email };
    });
  }, []);

  const bindMicrosoft = useCallback(() => {
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, microsoft_email: 'alexander.vance@outlook.com' };
    });
  }, []);

  return { profile, isLoading, error, bindGoogle, bindMicrosoft };
}
