import { ApiProperty } from "@nestjs/swagger";
import {usersCreateInput} from "../../generated/prisma/models"
export class MicrosoftAuthDto{
    @ApiProperty()
    code: string;
    // @ApiProperty()
    // code_verifier: string;
    @ApiProperty()
    redirect_uri: string;
}

export interface MicrosoftAccessTokenResponse {
    access_token: string;
    refresh_token: string;
}

export interface MicrosoftUser {
    email: string;
  givenname: string;
  familyname: string;
}