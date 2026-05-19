import { useCallback } from 'react';
import type { UserProfileDto } from '../components/profile/types';

/**
 * Binds a Microsoft account to the user's profile.
 * Replace with real API call: POST /users/me/bind-microsoft
 */
export function useBindMicrosoft(
  setProfile: React.Dispatch<React.SetStateAction<UserProfileDto | null>>,
) {
  const bindMicrosoft = useCallback(() => {
    // Optimistic update
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, microsoft_email: 'alexander.vance@outlook.com' };
    });
    // In real impl: await usersApi.bindMicrosoft()
  }, [setProfile]);

  return { bindMicrosoft };
}
