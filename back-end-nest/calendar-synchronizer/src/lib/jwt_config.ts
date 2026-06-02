import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
export const jwtConfig : JwtModuleAsyncOptions = {
    imports: [],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
    const privateKey = configService.get<string>('JWT_PRIVATE');
    const publicKey = configService.get<string>('JWT_PUBLIC');

    if (!privateKey || !publicKey) {
        throw new Error('JWT_PRIVATE and JWT_PUBLIC must be defined in environment variables');
    }

    return {
        privateKey: privateKey.replace(/\\n/g, '\n'),
        publicKey: publicKey.replace(/\\n/g, '\n'),
        signOptions: {
        algorithm: 'RS256',
        expiresIn: '1h',
        },
    };
    },
};