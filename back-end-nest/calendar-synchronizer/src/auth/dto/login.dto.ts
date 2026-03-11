import {ApiProperty} from "@nestjs/swagger";

export class LoginDto{
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}

export class DummyMicrosoftLoginDto{
    @ApiProperty({default: "sean.spencr@outlook.com"})
    email : string;

}

export class DummyGoogleLoginDto{
    @ApiProperty({default: "seanspencer280806@gmail.com"})
    email : string;
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