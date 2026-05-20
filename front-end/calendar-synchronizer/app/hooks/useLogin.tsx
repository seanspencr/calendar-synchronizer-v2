import { useState } from "react";
import { AuthApi, LoginDto, LoginResponseDto } from '../api-client/api';
import { Configuration } from "../api-client/configuration";

const configuration = new Configuration({
  basePath: `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`
});
const apiInstance = new AuthApi(configuration);

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<LoginResponseDto | null>(null);

  function login(loginDto: LoginDto) {
    if (!loginDto.username || !loginDto.password) {
      throw new Error("Username and password are required");
    }

    setIsLoading(true);
    setError(null);

    apiInstance.authControllerLogin(loginDto)
      .then(res => {
        setResponse(res.data); // ✅ context will handle saving to storage
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return { login, isLoading, response, error };
}