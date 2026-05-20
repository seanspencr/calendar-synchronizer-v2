import { useEffect, useState } from "react";
import { useGoogleAuthCode } from "./useGoogleAuthCode";
import { googleConfig } from "../lib/googleConfig";
import * as Google from "expo-auth-session/providers/google";
import { GoogleService } from "../services/googleService";
import { Platform } from "react-native";
import { StorageService } from "../services/storageService";
import { LoginResponseDto } from "../api-client";
import * as AuthSession from "expo-auth-session"
export function useGoogleRegister() {

    const [gooogleRequest, googleResponse, promptAsync] = Google.useAuthRequest(googleConfig);
    const [registerResponse, setGoogleRegisterResponse] = useState<LoginResponseDto | null>(null);
    const [isError, setIsError] = useState(false);

    async function signInWithGoogle() {
        if (googleResponse == null || googleResponse == undefined) return;
        if (gooogleRequest == null || gooogleRequest == undefined) return;
        if (googleResponse?.type !== "success") return;
        // signInWithGoogle();

        console.log(googleResponse)
        const code = googleResponse?.params?.code;
        const codeVerifier = gooogleRequest.codeVerifier;
        // TODO : bikin if else dia di mobile atau di web, soalnya redirect URI di web beda ma di mobile
        let redirectUri: string | undefined = undefined;

        if (Platform.OS === "android") {
            redirectUri = AuthSession.makeRedirectUri({
                scheme: "calendarsynchronizer"
            });
        } else {
            redirectUri = gooogleRequest.redirectUri;
        }

        console.log("Redirect URI : " + redirectUri)

        try {
            let loginResponse = await GoogleService.loginWithGoogleAuthCode(code, codeVerifier!, redirectUri);
            
            await StorageService.saveAccessToken(loginResponse.accessToken)
            
            setGoogleRegisterResponse(loginResponse);
        } catch (error) {
            console.error("Error during Google registration:", error);
            setIsError(true);
        }

    }

    useEffect(() => {
        signInWithGoogle();
    }, [googleResponse]);


    return { isError, registerResponse, promptAsync };
}
