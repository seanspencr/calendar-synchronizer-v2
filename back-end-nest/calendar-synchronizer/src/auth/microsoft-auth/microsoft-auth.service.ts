import { Client } from '@microsoft/microsoft-graph-client/lib/src/Client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { UsersService } from 'src/users/users.service';
import { AccessTokenPayload } from '../dto/accessToken.dto';
import axios from 'axios';
import { MicrosoftAccessTokenResponse, MicrosoftUser } from '../dto/microsoftAuth.dto';

@Injectable()
export class MicrosoftAuthService {

    constructor(private userService: UsersService, private configService: ConfigService) {
        
    }

    async getMicrosoftAccessToken(email : string) : Promise<string | null> {
        const user = await this.userService.findOauthUser(email);

        if(!user || !user.microsoft_refresh_token) {
            throw new UnauthorizedException("User not found or does not have a Microsoft refresh token");
        }


        const clientId = this.configService.get<string>('MICROSOFT_CLIENT_ID');
        const clientSecret = this.configService.get<string>('MICROSOFT_CLIENT_SECRET');
        const tenant = this.configService.get<string>('MICROSOFT_TENANT_ID');

        if(!clientId || !clientSecret || !tenant) {
            console.error("Microsoft OAuth configuration is missing. Please check environment variables.");
            throw new Error("Microsoft OAuth configuration is missing");
        }

        const params = new URLSearchParams();
        params.append("client_id", clientId!);
        params.append("client_secret", clientSecret!);
        params.append("refresh_token", user.microsoft_refresh_token!);
        params.append("grant_type", "refresh_token");
        params.append("scope", "openid profile email https://graph.microsoft.com/Calendars.Read offline_access");

        const response = await fetch(`https://login.microsoftonline.com/consumers/oauth2/v2.0/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        }).then(res => res.json()).then(data => {
            console.log("Microsoft token response:", data);
            return data;
        }).catch(error => {
            console.error("Error fetching Microsoft access token:", error);
            throw new Error("Failed to fetch Microsoft access token");
        });

        return response.access_token;
    }

    getAuthenticatedClient(accessToken: string): Client {
        return Client.init({
            authProvider: async (done) => {
                done(null, `Bearer ${accessToken}`);
            },
        });
    }

    public async authMicrosoftUser(authCode : string, redirectUri: string) : Promise<AccessTokenPayload>{
        
        // const params = new URLSearchParams();
        // params.append("client_id", this.configService.get<string>('MICROSOFT_CLIENT_ID')!);
        // params.append("client_secret", this.configService.get<string>('MICROSOFT_CLIENT_SECRET')!);
        // params.append("code", authCode);
        // params.append("redirect_uri", redirectUri);
        // params.append("grant_type", "authorization_code");
        // params.append("code_verifier", codeVerifier);
        
        try{
            const tokenResponse = await axios.post(`https://login.microsoftonline.com/consumers/oauth2/v2.0/token`, {
                client_id: this.configService.get<string>('MICROSOFT_CLIENT_ID')!,
                client_secret: this.configService.get<string>('MICROSOFT_CLIENT_SECRET')!,
                code: authCode,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
                // code_verifier: codeVerifier
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const tokenData : MicrosoftAccessTokenResponse = await tokenResponse.data;
            const accessToken = tokenData.access_token;
            const refreshToken = tokenData.refresh_token;

            if (!tokenData.access_token) {
                throw new Error('Failed to exchange code for token');
            }


            // setelah dapet token, cari userinfo


            const userInfoResponse = await axios.get('https://graph.microsoft.com/oidc/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!userInfoResponse) {
                throw new Error(`Failed to fetch user data: ${userInfoResponse}`);
            }

            const user : MicrosoftUser = userInfoResponse.data;

            // upsert user

            let existingUser = await this.userService.findOauthUser(user.email);

            if(existingUser){
                let updated = await this.userService.updateOauthUserRefreshToken(existingUser.id, "microsoft", refreshToken);
                console.log("Updated Microsoft refresh token for existing user:", updated);

                return {email : existingUser.email, userId : existingUser.id, username : existingUser.username!};
            }else{
                let newUser = await this.userService.createOauthUser({
                    email : user.email,
                    password : "null",
                    username : user.givenname + " " + user.familyname,
                    microsoft_refresh_token : refreshToken,
                });

                return {email : newUser.email, userId : newUser.id, username : newUser.username!};
            }

        }catch(error){
            console.error(error);
            throw new Error(error.message || 'Failed to exchange code for token');
        }
    }

    public async authMicrosoftUserOld(email : string, microsoft_refresh_token : string, username : string) : Promise<AccessTokenPayload>{
        
        let existingUser = await this.userService.findOauthUser(email);

        if(existingUser){
            
            let updated = await this.userService.updateOauthUserRefreshToken(existingUser.id, "microsoft", microsoft_refresh_token);
            console.log("Updated Microsoft refresh token for existing user:", updated);

            return {
                email : existingUser.email,
                userId : existingUser.id,
                username : existingUser.username!
            };
        }
        
        let newUser = await this.userService.createOauthUser({
            email : email,
            microsoft_refresh_token: microsoft_refresh_token,
            username : username,
            password : "null"
        });

        
        return {
            email : newUser.email,
            userId : newUser.id,
            username : newUser.username!
        };
    }
}
