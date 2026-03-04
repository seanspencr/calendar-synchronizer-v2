import { useEffect, useState } from "react";
import { useMicrosoftLogin } from "./useMicrosoftLogin";
import axios from "axios";
import { AuthApi, Configuration } from "../api-client";
import { microsoftConfig, redirectUri } from "../lib/microsoftConfig";


const configuration = new Configuration({
        basePath : `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`
    });
const apiInstance = new AuthApi(configuration);

export function useMicrosoftRegister(){
    const [microsoftRequest, microsoftResponse, microsoftPromptAsync] = useMicrosoftLogin()
    const [registerResponse, setRegisterResponse] = useState<any>()
    const [isLoadingMicrosoft, setIsLoading] = useState<boolean>(false)


    async function fetchMicrosoftUserData(token : string) : Promise<{email : string, givenName : string, familyName : string}>{
    
        const response = await fetch("https://graph.microsoft.com/oidc/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
        });
        const user = await response.json();

        console.log("Microsoft user data:", user);
        // setUserInfo(normalizedUser);
        // await AsyncStorage.setItem("user", JSON.stringify(normalizedUser));
        return {email : user.email, familyName : user.familyname, givenName : user.givenname}
    };

    
    async function exchangeCodeForToken(microsoftResponse : any) : Promise<{accessToken : string, refreshToken : string}>{
      if(microsoftRequest == null || microsoftRequest.codeVerifier === undefined || microsoftRequest.codeVerifier === null ) {
        console.error("Code verifier is undefined. Cannot exchange code for token.");
        throw new Error("Code verifier is undefined. Cannot exchange code for token.");
      }
  
        const { code } = microsoftResponse.params;
        const response = await fetch(`https://login.microsoftonline.com/common/oauth2/v2.0/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
            client_id: microsoftConfig.CLIENT_ID,
            code: code,
            redirect_uri: redirectUri, // Must match EXACTLY what was sent in the request
            grant_type: 'authorization_code',
            code_verifier: microsoftRequest.codeVerifier, // Include the code verifier for PKCE
            }).toString(),
        });

        const data = await response.json();
        
        if (data.access_token) {
            // Now that you have the token, go get the user data!
            fetchMicrosoftUserData(data.access_token);
        }

        return {accessToken : data.access_token, refreshToken : data.refresh_token}
    };


    async function register(microsoftResponse : any){
         if(!microsoftResponse) return;

        let {accessToken, refreshToken} = await exchangeCodeForToken(microsoftResponse)
        let {email, familyName, givenName} = await fetchMicrosoftUserData(accessToken);

        apiInstance.authControllerRegisterMicrosoftUser({
            email : email, microsoft_refresh_token : refreshToken, username : `${givenName} ${familyName}`
        })
    }

    // if(googleAuthCode == null || googleAuthCode == undefined || googleAuthCode == "") return;

    //     console.log("Exchanging code for token with code:", code);
    //     try {
    //       const response = await axios.post(`${apiUrl}/auth/register/google`, { "authCode" : code, "codeVerifier" : codeVerifier , "redirectUri" : redirectUri});
    //       return response.data; // Assuming the backend returns the token in the response body
    //     } catch (error) {
    //       console.error("Error exchanging code for token:", error);
    //       throw error;
    //     }
    //   };
    useEffect(()=>{
        if(!microsoftResponse) return;
        setIsLoading(true);
       register(microsoftResponse)
    }, [microsoftResponse])

    useEffect(()=>{
        if(!registerResponse) return;
        setIsLoading(false);
    },[registerResponse])

    return {isLoadingMicrosoft, registerResponse, microsoftPromptAsync}
}