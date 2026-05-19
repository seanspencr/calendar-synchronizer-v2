import { useState } from 'react';
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

/**
 * Fetches the current user's profile.
 * Replace with real API call: GET /users/me
 */
export function useGetProfile() {
  const [profile, setProfile] = useState<UserProfileDto | null>(DUMMY_PROFILE);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  return { profile, setProfile, isLoading, error };
}
