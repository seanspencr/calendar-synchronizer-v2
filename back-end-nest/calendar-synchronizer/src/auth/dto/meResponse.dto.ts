import { ApiProperty } from "@nestjs/swagger";

export class MeResponseDto {
    @ApiProperty()
    userId: string;
    @ApiProperty({ nullable: true })
    google_email: string | null;
    @ApiProperty({ nullable: true })
    microsoft_email: string | null;
    @ApiProperty()
    username: string;
}