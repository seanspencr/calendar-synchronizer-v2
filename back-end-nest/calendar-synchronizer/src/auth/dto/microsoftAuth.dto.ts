import { ApiProperty } from "@nestjs/swagger";
import {usersCreateInput} from "../../generated/prisma/models"
export class MicrosoftAuthDto implements usersCreateInput{
    @ApiProperty()
    username: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    microsoft_refresh_token: string;
}