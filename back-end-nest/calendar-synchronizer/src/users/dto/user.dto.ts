import { users } from 'src/generated/prisma/client';


export class UserDto implements users {
    id: string;
    username: string | null;
    created_at: Date;
    password: string | null;
    google_email: string | null;
    google_refresh_token: string | null;
    microsoft_refresh_token: string | null;
    microsoft_email: string | null;
}