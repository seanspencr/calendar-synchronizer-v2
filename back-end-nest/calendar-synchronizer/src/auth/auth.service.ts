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

    public async dummyAuthMicrosoftUser(email : string) : Promise<AccessTokenPayload>{
        let existingUser = await this.userService.findOauthUser(email);
        if(existingUser){
            return {
                email : existingUser.email,
                userId : existingUser.id,
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
                userId : existingUser.id,
                username : existingUser.username!
            };
        }
        throw new UnauthorizedException("User not found");
    }


}
