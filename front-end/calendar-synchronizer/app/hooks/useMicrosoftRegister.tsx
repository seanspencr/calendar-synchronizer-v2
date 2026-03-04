import { useEffect, useState, useCallback } from 'react';
import { MicrosoftService } from '../services/microsoftService';
import { StorageService } from '../services/storageService';
import { authApi } from '../services/apiService';
import { Platform } from 'react-native';
import { microsoftConfig, redirectUri } from '../lib/microsoftConfig';
import * as AuthSession from 'expo-auth-session';

export function useMicrosoftRegister() {

  const [microsoftRequest, microsoftResponse, promptAsync] = AuthSession.useAuthRequest(
        {
          clientId: microsoftConfig.CLIENT_ID!,
          redirectUri: redirectUri,
          scopes: ['openid', 'profile', 'email', 'Calendars.Read', 'offline_access'],
          responseType: AuthSession.ResponseType.Code,
        },
        microsoftConfig.discovery
      );


  const [registerResponse, setRegisterResponse] = useState<any>(null);
  const [isLoadingMicrosoft, setIsLoading] = useState(false);
  const [errorMsg, setError] = useState<string | null>(null);

  const register = useCallback(async () => {
    if (!microsoftResponse || !microsoftRequest?.codeVerifier) return;

    try {
      setIsLoading(true);
      setError(null);


      console.log('Microsoft auth response:', microsoftResponse);
      // 1. Exchange code for tokens
      const { accessToken, refreshToken } = await MicrosoftService.exchangeCodeForToken(
        microsoftResponse.params.code,
        microsoftRequest.codeVerifier,
      );

      // 2. Get user info from Microsoft
      const { email, givenName, familyName } = await MicrosoftService.fetchUserData(accessToken);

      // 3. Register with backend
      const response = await authApi.authControllerRegisterMicrosoftUser({
        email,
        microsoft_refresh_token: refreshToken,
        username: `${givenName} ${familyName}`,
      });

      // 4. Persist tokens + user info locally
      if(Platform.OS === "android"){
          await StorageService.saveAccessToken(accessToken);
          await StorageService.saveUserInfo({ email, givenName, familyName });
      }

      setRegisterResponse(response);

    } catch (err) {

      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      console.error('Microsoft registration error:', err);

    } finally {

      setIsLoading(false);
    }
  }, [microsoftResponse, microsoftRequest]);

  useEffect(() => {
    register();
  }, [register]);

  return { isLoadingMicrosoft, registerResponse, errorMsg, promptAsync };
}