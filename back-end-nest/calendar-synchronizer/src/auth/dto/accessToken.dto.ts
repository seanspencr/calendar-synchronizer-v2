import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenPayload {
    userId: string;
    google_email: string | null;
    microsoft_email: string | null;
    username: string;
}