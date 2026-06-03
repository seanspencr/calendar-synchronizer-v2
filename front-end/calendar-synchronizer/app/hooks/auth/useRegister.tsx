import { useState } from "react";
import { AuthApi, LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto } from '../../api-client/api';
import { Configuration } from "../../api-client/configuration";
import { AuthService } from "@/app/services/authService";

const configuration = new Configuration({
    basePath: `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`
});
const apiInstance = new AuthApi(configuration);

export function useRegister() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<RegisterResponseDto | null>(null);

    function register(registerDto: RegisterDto) {
        if (!registerDto.username || !registerDto.password) {
            throw new Error("Username and password are required");
        }

        setIsLoading(true);
        setError(null);

        AuthService.register(registerDto)
            .then(res => {
                setResponse(res);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return { register, isLoading, response, error };
}