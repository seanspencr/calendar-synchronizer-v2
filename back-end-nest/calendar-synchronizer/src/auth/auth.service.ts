import { HttpCode, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { check_password, hash_password } from 'src/lib/hash_password';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import { GoogleTokenResponse } from './dto/googleToken.dto';
import { usersModel } from 'src/generated/prisma/models';
import { MicrosoftAuthDto } from './dto/microsoftAuth.dto';
import { AccessTokenPayload } from './dto/accessToken.dto';

@Injectable()
export class AuthService {
    private databaseService: DatabaseService;
    private userService: UsersService;
    constructor(databaseService: DatabaseService, userService: UsersService) {
        this.databaseService = databaseService;
        this.userService = userService;
    }

    
    public async login({username, password}: {username: string, password: string}) : Promise<AccessTokenPayload>{
        let user : usersModel | undefined | null = await this.databaseService.users.findFirst({
            where: {
                username: username
            }
        });
        
        if (user == null || user == undefined) {
            throw new UnauthorizedException("User not found");
        }

        if(!check_password(password, user.password!)){
            throw new UnauthorizedException("Invalid password");
        }

        
        return {email : user.email, userId : user.email, username : user.username!};
    }

    public async register(createUserDto : CreateUserDto){
        return this.userService.create(createUserDto);
    }

    public async authMicrosoftUser(email : string, microsoft_refresh_token : string, username : string) : Promise<AccessTokenPayload>{
        
        let existingUser = await this.userService.findOauthUser(email);

        if(existingUser){
            
            let updated = await this.userService.updateOauthUserRefreshToken(existingUser.id, "microsoft", microsoft_refresh_token);
            console.log("Updated Microsoft refresh token for existing user:", updated);

            return {
                email : existingUser.email,
                userId : existingUser.email,
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
            userId : newUser.email,
            username : newUser.username!
        };
    }

    public async dummyAuthMicrosoftUser(email : string) : Promise<AccessTokenPayload>{
        let existingUser = await this.userService.findOauthUser(email);
        if(existingUser){
            return {
                email : existingUser.email,
                userId : existingUser.email,
                username : existingUser.username!
            };
        }
        throw new UnauthorizedException("User not found");
    }

    public async dummyAuthGoogleUser(email : string) : Promise<AccessTokenPayload>{
        let existingUser = await this.userService.findOauthUser(email);
        if(existingUser){
            return {
                email : existingUser.email,
                userId : existingUser.email,
                username : existingUser.username!
            };
        }
        throw new UnauthorizedException("User not found");
    }

    public async authGoogleUser(googleAuthCode : string,  codeVerifier: string, redirectUri: string) : Promise<AccessTokenPayload>{
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

        try{
            const tokenResponse : GoogleTokenResponse = (await axios.post(api_url, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },})).data;
            console.log("Google token response:", tokenResponse);


            // get user info from google
            const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`
                }
            });
            console.log("Google user info response:", userInfoResponse.data);
            const { email, name } = userInfoResponse.data;

            // if exist
            let existing = await this.userService.findOauthUser(email);
            if(existing){
                return {
                    email : existing.email,
                    userId : existing.email,
                    username : existing.username!
                };
            }

            // klo gaada, daftarin baru
            const refreshToken = tokenResponse.refresh_token;
            if(!refreshToken){
                throw new UnauthorizedException("Failed to obtain refresh token from Google");
            }
            
            let newUser = await this.userService.createOauthUser({
                email: email,
                password: "null",
                username: name,
                google_refresh_token: refreshToken
            });
            
            return {
                email : newUser.email,
                userId : newUser.email,
                username : newUser.username!
            };

            
        }catch(error){
            console.error("Error exchanging code for token:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error request headers:", error.config.headers);
            console.error("Error request data:", error.config.data);
            throw new UnauthorizedException("Failed to exchange code for token with Google");
        }
    }
}
