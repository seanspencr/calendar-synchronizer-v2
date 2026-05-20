import { AccessTokenPayload } from "./accessToken.dto";
import { GoogleUserDto } from "./googleUser.dto";
import { MicrosoftUser } from "./microsoftUser.dto";

export class MeResponseDto extends AccessTokenPayload {
    googleUser: GoogleUserDto | null;
    microsoftUser: MicrosoftUser | null;
}