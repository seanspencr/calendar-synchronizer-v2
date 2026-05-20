import { Client } from '@microsoft/microsoft-graph-client/lib/src/Client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { UsersService } from 'src/users/users.service';
import { AccessTokenPayload } from '../dto/accessToken.dto';
import axios from 'axios';
import { MicrosoftAccessTokenResponse } from '../dto/microsoftAuth.dto';
import { MicrosoftUser } from '../dto/microsoftUser.dto';
import { users } from 'src/generated/prisma/client';

@Injectable()
export class MicrosoftAuthService {

    constructor(private userService: UsersService, private configService: ConfigService) {

    }

    async getMicrosoftAccessToken(email: string): Promise<string | null> {
        const user = await this.userService.findMicrosoftUser(email);

        if (!user || !user.microsoft_refresh_token) {
            throw new UnauthorizedException("User not found or does not have a Microsoft refresh token");
        }

        const clientId = this.configService.get<string>('MICROSOFT_CLIENT_ID');
        const clientSecret = this.configService.get<string>('MICROSOFT_CLIENT_SECRET');
        const tenant = this.configService.get<string>('MICROSOFT_TENANT_ID');

        if (!clientId || !clientSecret || !tenant) {
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
                done(null, `${accessToken}`);
            },
        });

    }

    
    public async getMicrosoftUserByAccessToken(accessToken: string): Promise<MicrosoftUser | null>  {

        console.log("Access token for fetching Microsoft user info:", accessToken);

        const userInfoResponse = await axios.get('https://graph.microsoft.com/oidc/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userInfoResponse) {
            throw new Error(`Failed to fetch user data: ${userInfoResponse}`);
        }

        const user: MicrosoftUser = userInfoResponse.data;
        console.log("Microsoft user info response:", user);
        return user
    }

    public async getMicrosoftUser(email: string): Promise<MicrosoftUser | null>  {

        try {
            const accessToken = await this.getMicrosoftAccessToken(email);
            console.log("Access token for fetching Microsoft user info:", accessToken);

            if(!accessToken){
                throw new Error("Failed to get Microsoft access token for user " + email);
            }

           return await this.getMicrosoftUserByAccessToken(accessToken)

        }catch (error) {
            console.error("Error getting Microsoft access token for user info:", error);
            return null;
        }
    }

    public async exchangeAuthCodeForToken(authCode: string, redirectUri: string): Promise<MicrosoftAccessTokenResponse> {
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

        const tokenData: MicrosoftAccessTokenResponse = await tokenResponse.data;
        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token;

        if (!tokenData.access_token) {
            throw new Error('Failed to exchange code for token');
        }

        return tokenData;
    }


    public async bindMicrosoftUser(userId : string, authCode: string, redirectUri: string): Promise<users> {
        const tokenData = await this.exchangeAuthCodeForToken(authCode, redirectUri);
    
        if (!tokenData.access_token) {
            throw new Error('Failed to exchange code for token');
        }

        const user = await this.getMicrosoftUserByAccessToken(tokenData.access_token);

        if(!user){
            throw new Error("Failed to fetch user info from Microsoft");
        }

        const updatedUser = await this.userService.update(userId, {
            microsoft_email: user.email,
            microsoft_refresh_token: tokenData.refresh_token,
        })

        return updatedUser;
    }

    public async authMicrosoftUser(authCode: string, redirectUri: string): Promise<AccessTokenPayload> {

        try {
            const tokenData = await this.exchangeAuthCodeForToken(authCode, redirectUri);

            if (!tokenData.access_token) {
                throw new Error('Failed to exchange code for token');
            }

            // setelah dapet token, cari userinfo
            const user = await this.getMicrosoftUserByAccessToken(tokenData.access_token);
            if(!user){
                throw new Error("Failed to fetch user info from Microsoft");
            }

            // upsert user

            let existingUser = await this.userService.findMicrosoftUser(user.email);

            if (existingUser) {
                let updated = await this.userService.updateOauthUserRefreshToken(existingUser.id, "microsoft", tokenData.refresh_token);
                console.log("Updated Microsoft refresh token for existing user:", updated);

                return { microsoft_email: existingUser.microsoft_email, google_email : existingUser.google_email, userId: existingUser.id, username: existingUser.username! };
            } else {
                let newUser = await this.userService.createMicrosoftUser({
                    google_email: null,
                    microsoft_email: user.email,
                    password: "null",
                    username: user.givenname + " " + user.familyname,
                    microsoft_refresh_token: tokenData.refresh_token,
                });

                return { microsoft_email: newUser.microsoft_email, google_email : newUser.google_email, userId: newUser.id, username: newUser.username! };
            }

        } catch (error) {
            console.error(error);
            throw new Error(error.message || 'Failed to exchange code for token');
        }
    }
}
