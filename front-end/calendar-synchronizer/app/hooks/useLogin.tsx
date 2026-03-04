import { useState } from "react";
import {useQuery} from "@tanstack/react-query"
import {
    AuthApi,
    LoginDto,
    LoginResponseDto
} from '../api-client/api';

import { Configuration } from "../api-client/configuration";


const configuration = new Configuration({
        basePath : `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`
    });
const apiInstance = new AuthApi(configuration);

export function useLogin(){

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<LoginResponseDto | null>(null);

    function login(loginDto : LoginDto){
        if(!loginDto.username || !loginDto.password){
            throw new Error("Username and password are required");
        }

        setIsLoading(true);
        apiInstance.authControllerLogin(
            loginDto
        ).then(res => {
            let data = res.data;
            setResponse(data);
            setIsLoading(false);
        }).catch(err => {
            setError(err.message);
            setIsLoading(false);
        });
    }

    return {login, isLoading, response, error}
}