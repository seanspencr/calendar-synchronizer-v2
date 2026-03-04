import {ApiProperty} from "@nestjs/swagger";

export class LoginDto{
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}

export class LoginResponseDto{
    @ApiProperty()
    accessToken : string;
    @ApiProperty()
    email : string;
    @ApiProperty()
    userid : string;
    @ApiProperty()
    username : string;
}