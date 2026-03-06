import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleAuthService {


    constructor(private userService: UsersService) {}

    async getGoogleAccessToken(email : string) : Promise<string | null> {
        const user = await this.userService.findOauthUser(email);
        

        throw new Error("Not implemented");
    }
}
