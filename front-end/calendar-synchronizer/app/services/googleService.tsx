import { LoginResponseDto } from "../api-client";
import { authApi } from "./apiService";

export const GoogleService = {
  async loginWithGoogleAuthCode(code: string, codeVerifier: string, redirectUri: string) : Promise<LoginResponseDto> {
    if (!code) throw new Error("Google auth code is required");
    console.log("Exchanging code for token with code:", code);
    try {
      const response = await authApi.authControllerRegisterGoogleUser({
        authCode: code,
        codeVerifier: codeVerifier,
        redirectUri: redirectUri,
      });

      return response.data;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  },
};