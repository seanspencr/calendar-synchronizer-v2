import { useState } from 'react';
import type { UserProfileDto } from '../components/profile/types';
import { AuthApi, MeResponseDto } from '../api-client';
import { authApi } from '../services/apiService';

export function useGetProfile() {
  const [profile, setProfile] = useState<MeResponseDto | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, isError] = useState<string | null>(null);

  async function fetchProfile() {
    setLoading(true);
    isError(null);
    try {
      const response = await authApi.authControllerMe();
      setProfile(response.data);
    } catch (err) {
      isError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }

  return { profile, setProfile, isLoading, error, fetchProfile };
}
