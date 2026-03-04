import { useEffect, useState } from "react";
import { useGoogleAuthCode } from "./useGoogleAuthCode";
import { googleConfig } from "../lib/googleConfig";
import * as Google from "expo-auth-session/providers/google";
import { GoogleService } from "../services/googleService";
import { Platform } from "react-native";
import { StorageService } from "../services/storageService";
import { LoginResponseDto } from "../api-client";

export function useGoogleRegister() {

    const [gooogleRequest, googleResponse, promptAsync] = Google.useAuthRequest(googleConfig);
    const [registerResponse, setGoogleRegisterResponse] = useState<LoginResponseDto | null>(null);
    const [isError, setIsError] = useState(false);

    async function signInWithGoogle() {
        if(googleResponse == null || googleResponse == undefined) return;
        if(gooogleRequest == null || gooogleRequest == undefined) return;
        // signInWithGoogle();

        console.log(googleResponse)
        const code = googleResponse?.params?.code;
        const codeVerifier = gooogleRequest.codeVerifier;
        const redirectUri = gooogleRequest.redirectUri;
        
        try{
            let loginResponse = await GoogleService.exchangeCodeForToken(code, codeVerifier!, redirectUri);
            if(Platform.OS === "android"){
                // simpen access token di secure storgae
                await StorageService.saveAccessToken(loginResponse.accessToken);
            }
            setGoogleRegisterResponse(loginResponse);
        }catch(error){
            console.error("Error during Google registration:", error);
            setIsError(true);
        }
        
    }

    useEffect(() => {
        signInWithGoogle();
    }, [gooogleRequest, googleResponse]);


    return { isError, registerResponse, promptAsync };
}
