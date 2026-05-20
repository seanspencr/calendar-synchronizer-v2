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

  async loginWithMicrosoftAuthCode(code: string, redirectUri: string) : Promise<LoginResponseDto> {
      if (!code) throw new Error("Microsoft auth code is required");
  
      console.log("Exchanging code for token with code:", code);
      try {
        const response = await authApi.authControllerRegisterMicrosoftUser({
          code: code,
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