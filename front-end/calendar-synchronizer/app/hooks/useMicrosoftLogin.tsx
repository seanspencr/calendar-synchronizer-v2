import * as AuthSession from 'expo-auth-session';
import { microsoftConfig, redirectUri } from '../lib/microsoftConfig';
export function useMicrosoftLogin(){
    
     console.log("useMicrosoftLogin :  Redirect URI:", redirectUri);
    return AuthSession.useAuthRequest(
        {
          clientId: microsoftConfig.CLIENT_ID!,
          redirectUri: redirectUri,
          scopes: ['openid', 'profile', 'email', 'Calendars.Read', 'offline_access'],
          responseType: AuthSession.ResponseType.Code,
        },
        microsoftConfig.discovery
      );
}