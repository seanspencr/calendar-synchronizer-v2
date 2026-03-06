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
          scopes: ['openid', 'profile', 'email', 'https://graph.microsoft.com/Calendars.Read', 'offline_access'],
          responseType: AuthSession.ResponseType.Code,
          usePKCE: false,
          extraParams:{
            prompt: 'consent'
          }
        },
        microsoftConfig.discovery
      );


  const [registerResponse, setRegisterResponse] = useState<any>(null);
  const [isLoadingMicrosoft, setIsLoading] = useState(false);
  const [errorMsg, setError] = useState<string | null>(null);

  const register = useCallback(async () => {

    console.log(microsoftResponse)
    if (!microsoftResponse) return;

    try {
      setIsLoading(true);
      setError(null);


      console.log('Microsoft auth response:', JSON.stringify(microsoftResponse));

      const response = await MicrosoftService.loginWithMicrosoftAuthCode(
        microsoftResponse.params.code,
        microsoftRequest.codeVerifier,
        redirectUri
      )

      setRegisterResponse(response)

      if(Platform.OS === "android"){
          await StorageService.saveAccessToken(registerResponse.accessToken);
          // await StorageService.saveUserInfo({ email, givenName, familyName });
      }


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