import * as AuthSession from "expo-auth-session"
export const microsoftConfig = {
       CLIENT_ID: process.env.EXPO_PUBLIC_MICROSOFT_CLIENT_ID,
       REDIRECT_URI: 'http://localhost:8081',
      //  discovery: {
      //    authorizationEndpoint: `https://login.microsoftonline.com/${process.env.EXPO_PUBLIC_MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize`,
      //    tokenEndpoint: `https://login.microsoftonline.com/${process.env.EXPO_PUBLIC_MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      //  },
    
      discovery: {
         // Change the tenant ID variable to 'common'
         authorizationEndpoint: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`,
         tokenEndpoint: `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
       },


       shouldAutoExchangeCode : false
    };

export const redirectUri = AuthSession.makeRedirectUri();