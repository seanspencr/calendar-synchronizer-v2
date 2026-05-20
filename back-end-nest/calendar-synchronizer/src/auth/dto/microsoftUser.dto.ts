import { ApiProperty } from "@nestjs/swagger";

export class MicrosoftUser {
    @ApiProperty()
    email: string;
    @ApiProperty()
    givenname: string;
    @ApiProperty()
    familyname: string;
}