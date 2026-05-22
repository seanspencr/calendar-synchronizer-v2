import { useCallback, useEffect, useState } from 'react';
import type { UserProfileDto } from '../../components/profile/types';
import { microsoftConfig, redirectUri } from '@/app/lib/microsoftConfig';
import * as AuthSession from 'expo-auth-session';
import { AuthService } from '@/app/services/authService';
import { MeResponseDto, UserDto } from '@/app/api-client';
/**
 * Binds a Microsoft account to the user's profile.
 * Replace with real API call: POST /users/me/bind-microsoft
 */
export function useBindMicrosoft(
  setProfile: React.Dispatch<React.SetStateAction<MeResponseDto | null>>,
) {

  const [microsoftRequest, microsoftResponse, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: microsoftConfig.CLIENT_ID!,
      redirectUri: redirectUri,
      scopes: ['openid', 'profile', 'email', 'https://graph.microsoft.com/Calendars.Read', 'offline_access'],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: false,
      extraParams: {
        prompt: 'consent'
      }
    },
    microsoftConfig.discovery
  );

  const [bindResponse, setBindResponse] = useState<MeResponseDto | null>(null);
  const [isLoadingMicrosoft, setIsLoading] = useState(false);
  const [errorMsg, setError] = useState<string | null>(null);


  const bind = useCallback(async () => {

    console.log(microsoftResponse)
    if (!microsoftResponse) return;

    try {
      setIsLoading(true);
      setError(null);


      console.log('Microsoft auth response:', JSON.stringify(microsoftResponse));

      const response = await AuthService.bindMicrosoft({
        code: microsoftResponse.params.code,
        redirect_uri: redirectUri
      })


      setBindResponse(response)

    } catch (err) {

      const message = err instanceof Error ? err.message : 'Bind failed';
      setError(message);
      console.error('Microsoft bind error:', err);

    } finally {

      setIsLoading(false);
    }
  }, [microsoftResponse, microsoftRequest]);

  useEffect(() => {
    bind();
  }, [bind]);

  return { isLoadingMicrosoft, bindResponse, errorMsg, promptAsync };
}
