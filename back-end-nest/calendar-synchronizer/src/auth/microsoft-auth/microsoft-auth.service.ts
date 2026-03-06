import { Client } from '@microsoft/microsoft-graph-client/lib/src/Client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { UsersService } from 'src/users/users.service';

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
        params.append("scope", "https://graph.microsoft.com/.default");

        const response = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
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
}
