import { ApiProperty } from "@nestjs/swagger";

export class GoogleUserDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    email: string;
}
