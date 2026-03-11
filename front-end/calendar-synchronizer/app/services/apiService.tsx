import { AuthApi, Configuration } from '../api-client';
import { StorageService } from './storageService';

const configuration = new Configuration({
  basePath: `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`,
  // Attach token to every request automatically
  accessToken: async () => {
    const token = await StorageService.getAccessToken();
    return token ?? '';
  },
});

export const authApi = new AuthApi(configuration);