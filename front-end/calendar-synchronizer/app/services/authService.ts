import { authApi } from "./apiService";
import {
  MicrosoftAuthDto,
  DummyGoogleLoginDto,
  DummyMicrosoftLoginDto,
  LoginDto,
  GoogleAuthDto,
  LoginResponseDto,
  MeResponseDto,
  UserDto,
  RegisterDto,
  RegisterResponseDto
} from '../api-client';

export const AuthService = {

  /**
   * POST /auth/bind-microsoft
   */
  async bindMicrosoft(microsoftAuthDto: MicrosoftAuthDto): Promise<MeResponseDto> {
    try {
      const response = await authApi.authControllerBindMicrosoft(microsoftAuthDto);
      return response.data;
    } catch (error) {
      console.error("Error binding Microsoft account:", error);
      throw error;
    }
  },

  async bindGoogle(googleAuthDto: GoogleAuthDto): Promise<MeResponseDto> {
    try {
      const response = await authApi.authControllerBindGoogle(googleAuthDto);
      return response.data;
    } catch (error) {
      console.error("Error binding Google account:", error);
      throw error;
    }
  },

  /**
   * POST /auth/dummy-google
   */
  async dummyGoogleLogin(dummyGoogleLoginDto: DummyGoogleLoginDto): Promise<LoginResponseDto> {
    try {
      const response = await authApi.authControllerDummyGoogleLogin(dummyGoogleLoginDto);
      return response.data;
    } catch (error) {
      console.error("Error with dummy Google login:", error);
      throw error;
    }
  },

  /**
   * POST /auth/dummy-microsoft
   */
  async dummyMicrosoftLogin(dummyMicrosoftLoginDto: DummyMicrosoftLoginDto): Promise<LoginResponseDto> {
    try {
      const response = await authApi.authControllerDummyMicrosoftLogin(dummyMicrosoftLoginDto);
      return response.data;
    } catch (error) {
      console.error("Error with dummy Microsoft login:", error);
      throw error;
    }
  },

  /**
   * GET /auth/google/callback
   */
  async googleAuthCallback(): Promise<void> {
    try {
      const response = await authApi.authControllerGoogleAuthCallback();
      return response.data;
    } catch (error) {
      console.error("Error during Google auth callback:", error);
      throw error;
    }
  },

  /**
   * POST /auth/login
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const response = await authApi.authControllerLogin(loginDto);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  /**
   * GET /auth/me
   */
  async me(): Promise<MeResponseDto> {
    try {
      const response = await authApi.authControllerMe();
      return response.data;
    } catch (error) {
      console.error("Error fetching current user (me):", error);
      throw error;
    }
  },

  /**
   * POST /auth/register-google
   */

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    try {
      const response = await authApi.authControllerRegister(registerDto);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  async registerGoogleUser(googleAuthDto: GoogleAuthDto): Promise<LoginResponseDto> {
    try {
      const response = await authApi.authControllerRegisterGoogleUser(googleAuthDto);
      return response.data;
    } catch (error) {
      console.error("Error registering Google user:", error);
      throw error;
    }
  },

  /**
   * POST /auth/register-microsoft
   */
  async registerMicrosoftUser(microsoftAuthDto: MicrosoftAuthDto): Promise<LoginResponseDto> {
    try {
      const response = await authApi.authControllerRegisterMicrosoftUser(microsoftAuthDto);
      return response.data;
    } catch (error) {
      console.error("Error registering Microsoft user:", error);
      throw error;
    }
  }
};
