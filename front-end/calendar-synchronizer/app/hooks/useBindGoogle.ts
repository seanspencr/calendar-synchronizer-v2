import { useCallback } from 'react';
import type { UserProfileDto } from '../components/profile/types';

/**
 * Binds a Google account to the user's profile.
 * Replace with real API call: POST /users/me/bind-google
 */
export function useBindGoogle(
  setProfile: React.Dispatch<React.SetStateAction<UserProfileDto | null>>,
) {
  const bindGoogle = useCallback(() => {
    // Optimistic update
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, google_email: prev.email };
    });
    // In real impl: await usersApi.bindGoogle()
  }, [setProfile]);

  return { bindGoogle };
}
