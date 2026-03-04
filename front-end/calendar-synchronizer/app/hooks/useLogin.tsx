import { useState } from "react";
import {useQuery} from "@tanstack/react-query"
import {
    AuthApi,
    LoginDto
} from '../api-client/api';

import { Configuration } from "../api-client/configuration";


const configuration = new Configuration({
        basePath : `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`
    });
const apiInstance = new AuthApi(configuration);

export function useLogin(){

    const [isLoading, setIsLoading] = useState(true);
    const [response, setResponse] = useState<any>(null);

    function login(loginDto : LoginDto){
        if(!loginDto.username || !loginDto.password){
            throw new Error("Username and password are required");
        }

        apiInstance.authControllerLogin(
            loginDto
        ).then(res => {
            let data = res.data;
            setResponse(data);
            setIsLoading(false);
        });
    }

    return {login, isLoading, response}
}