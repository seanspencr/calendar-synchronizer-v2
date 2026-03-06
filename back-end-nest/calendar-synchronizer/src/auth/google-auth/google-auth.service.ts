import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';

@Injectable()
export class GoogleAuthService {


    constructor(private userService: UsersService, private configService: ConfigService) {}

    async getGoogleAccessToken(email : string) : Promise<string | null> {
        const user = await this.userService.findOauthUser(email);
        
        if(!user || !user.google_refresh_token) {
            console.error(`No user found with email ${email} or user does not have a Google refresh token`);
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
}
