import { ApiProperty } from "@nestjs/swagger";

export class GoogleAuthDto{
    @ApiProperty()
    authCode: string;
    @ApiProperty()
    codeVerifier: string;
    @ApiProperty()
    redirectUri: string;
}

