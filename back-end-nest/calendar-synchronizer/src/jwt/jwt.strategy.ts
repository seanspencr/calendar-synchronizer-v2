import {ExtractJwt, Strategy} from 'passport-jwt';
import { PassportStrategy} from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as cookieParser from "cookie-parser"
import { AccessTokenPayload } from 'src/auth/dto/accessToken.dto';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    cookieExtract(req): string | null {
        if (req?.cookies?.authorization) {
        return req.cookies['authorization'];
        }
        return null; // ✅ return null instead of throwing — lets the next extractor try
    }

    constructor(configService: ConfigService) {
        const publicKey = configService.get<string>('JWT_PUBLIC');

        if (!publicKey) {
            throw new Error('JWT_PUBLIC must be defined in environment variables');
        }

        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => this.cookieExtract(req),       // 1️⃣ try cookie first
                ExtractJwt.fromAuthHeaderAsBearerToken(), // 2️⃣ fallback to Authorization: Bearer
            ]),
            ignoreExpiration: false,
            secretOrKey: publicKey.replace(/\\n/g, '\n'),
            algorithms: ['RS256'],
        });
    }

    async validate(payload : AccessTokenPayload): Promise<AccessTokenPayload> {
        // apapun yang lu taro disini, nanti bakal nempel di request.user (.user ini bawaannya si passport)
        return payload;
    }
}