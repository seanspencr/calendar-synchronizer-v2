import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import { GoogleTokenResponse } from '../dto/googleToken.dto';
import { AccessTokenPayload } from '../dto/accessToken.dto';
import { GoogleUserDto } from '../dto/googleUser.dto';

@Injectable()
export class GoogleAuthService {


    constructor(private userService: UsersService, private configService: ConfigService) { }

    async getGoogleAccessToken(googleEmail: string): Promise<string | null> {
        const user = await this.userService.findGoogleUser(googleEmail);

        if (!user || !user.google_refresh_token) {
            console.error(`No user found with email ${googleEmail} or user does not have a Google refresh token`);
            console.error("User details:", user);
            throw new UnauthorizedException("User not found or does not have a Google refresh token");
        }

        const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

        const params = new URLSearchParams();
        params.append('client_id', clientId!);
        params.append('client_secret', clientSecret!);
        params.append('refresh_token', user.google_refresh_token!);
        params.append('grant_type', 'refresh_token');



        try {
            const response = await axios.post('https://oauth2.googleapis.com/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (response.data.access_token) {
                return response.data.access_token;
            }

            throw new UnauthorizedException('Failed to refresh Google token');

        } catch (error) {
            console.error('Google token refresh error:', error.response?.data || error.message);
            throw new UnauthorizedException('Failed to refresh Google token');
        }

    }

    public async getGoogleUserInfo(userEmail: string): Promise<GoogleUserDto | null> {

        try {
            const accessToken = await this.getGoogleAccessToken(userEmail);

            const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log("Google user info response:", userInfoResponse.data);
            const { email, name } = userInfoResponse.data;

            return { email, name }
        }catch (error) {
            console.error("Error fetching Google user info:", error);
            return null;
        }
    }

    public async getGoogleUserInfoByAccessToken(accessToken: string): Promise<GoogleUserDto | null>{
         const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log("Google user info response:", userInfoResponse.data);
        const { email, name } = userInfoResponse.data;

        return { email, name }
    }


    public async authGoogleUser(googleAuthCode: string, codeVerifier: string, redirectUri: string): Promise<AccessTokenPayload> {
        // handle token exchange dan get refresh token (gara2 gw google clound consolenya buat web pdhl hrsnya bisa auto)
        const api_url = "https://oauth2.googleapis.com/token";
        const params = new URLSearchParams();
        params.append("code", googleAuthCode);
        params.append("client_id", process.env.GOOGLE_CLIENT_ID!);
        params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET!);
        params.append("redirect_uri", redirectUri);
        params.append("grant_type", "authorization_code");
        params.append("code_verifier", codeVerifier);

        console.log("Redirect URI:", redirectUri);
        console.log("Exchanging code for token with Google, params:", params.toString());

        try {
            const tokenResponse: GoogleTokenResponse = (await axios.post(api_url, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })).data;
            console.log("Google token response:", tokenResponse);


            // get user info from google
            const user : GoogleUserDto | null = await this.getGoogleUserInfoByAccessToken(tokenResponse.access_token);
            if(!user){
                throw new Error("Failed to fetch user info from Google");
            }

            // if exist
            let existing = await this.userService.findGoogleUser(user.email);

            if (existing) {

                this.userService.updateOauthUserRefreshToken(existing.id, "google", tokenResponse.refresh_token!);

                return {
                    google_email: existing.google_email,
                    microsoft_email: existing.microsoft_email,
                    userId: existing.id,
                    username: existing.username!
                };
            }

            // klo gaada, daftarin baru
            const refreshToken = tokenResponse.refresh_token;
            if (!refreshToken) {
                throw new UnauthorizedException("Failed to obtain refresh token from Google");
            }

            let newUser = await this.userService.createGoogleUser({
                google_email: user.email,
                microsoft_email: null,
                password: "null",
                username: user.name,
                google_refresh_token: refreshToken,
                microsoft_refresh_token: null,
            });

            return {
                google_email: newUser.google_email,
                microsoft_email: newUser.microsoft_email,
                userId: newUser.id,
                username: newUser.username!
            };


        } catch (error) {
            console.error("Error exchanging code for token:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error request headers:", error.config.headers);
            console.error("Error request data:", error.config.data);
            throw new UnauthorizedException("Failed to exchange code for token with Google");
        }
    }
}
