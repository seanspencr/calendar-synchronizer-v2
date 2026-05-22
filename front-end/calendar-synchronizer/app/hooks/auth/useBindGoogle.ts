import { useCallback, useEffect, useState} from 'react';
import type { UserProfileDto } from '../../components/profile/types';
import * as Google from "expo-auth-session/providers/google";

import { Platform } from "react-native";
import { googleConfig } from "../../lib/googleConfig";
import { LoginResponseDto, UserDto } from '@/app/api-client';
import * as AuthSession from "expo-auth-session"
import { StorageService } from '@/app/services/storageService';
import { AuthService } from '@/app/services/authService';



/**
 * Binds a Google account to the user's profile.
 * Replace with real API call: POST /users/me/bind-google
 */
export function useBindGoogle(
  setProfile: React.Dispatch<React.SetStateAction<LoginResponseDto | null>>,
) {

   const [gooogleRequest, googleResponse, promptAsync] = Google.useAuthRequest(googleConfig);
   const [bindResponse, setBindResponse] = useState<LoginResponseDto | null>(null);
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
            let updated = await AuthService.bindGoogle({
              authCode : code,
              codeVerifier : codeVerifier!,
              redirectUri : redirectUri
            });


            setProfile((prev) => {
              if (!prev) return prev;
              return { ...prev, google_email: updated.google_email as string };
            });
            

        } catch (error) {
            console.error("Error during Google bind:", error);
            setIsError(true);
        }

    }

    useEffect(() => {
        signInWithGoogle();
    }, [googleResponse]);


    return { isError, bindResponse, promptAsync };
}
