import { ApiProperty } from "@nestjs/swagger";
import { usersCreateInput } from "src/generated/prisma/models";

export class CreateUserDto implements usersCreateInput {
    @ApiProperty()
    username: string;
    @ApiProperty()
    password?: string | null;
    @ApiProperty({ required: false })
    google_email?: string;

    @ApiProperty({ required: false })
    microsoft_email?: string;

    @ApiProperty({ required: false })
    google_refresh_token?: string;
    @ApiProperty({ required: false })
    microsoft_refresh_token?: string;
}
