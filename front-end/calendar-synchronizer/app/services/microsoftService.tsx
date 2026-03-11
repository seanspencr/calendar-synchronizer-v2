import { microsoftConfig, redirectUri } from '../lib/microsoftConfig';
import { LoginResponseDto } from '../api-client';
import { authApi } from "./apiService";
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface MicrosoftUser {
  email: string;
  givenName: string;
  familyName: string;
}

export const MicrosoftService = {
  // async exchangeCodeForToken(code: string, codeVerifier: string): Promise<TokenResponse> {
  //   const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     body: new URLSearchParams({
  //       client_id: microsoftConfig.CLIENT_ID,
  //       code,
  //       redirect_uri: redirectUri,
  //       grant_type: 'authorization_code',
  //       code_verifier: codeVerifier,
  //     }).toString(),
  //   });

  //   const data = await response.json();

  //   if (!data.access_token) {
  //     throw new Error(data.error_description || 'Failed to exchange code for token');
  //   }

  //   return { accessToken: data.access_token, refreshToken: data.refresh_token };
  // },

  async loginWithMicrosoftAuthCode(code: string, codeVerifier: string, redirectUri: string) : Promise<LoginResponseDto> {
      if (!code) throw new Error("Microsoft auth code is required");
  
      console.log("Exchanging code for token with code:", code);
      try {
        const response = await authApi.authControllerRegisterMicrosoftUser({
          code: code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri,
        });
  
        return response.data;
      } catch (error) {
        console.error("Error exchanging code for token:", error);
        throw error;
      }
    },

  async fetchUserData(accessToken: string): Promise<MicrosoftUser> {
    const response = await fetch('https://graph.microsoft.com/oidc/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    const user = await response.json();
    return { email: user.email, givenName: user.givenname, familyName: user.familyname };
  },
};