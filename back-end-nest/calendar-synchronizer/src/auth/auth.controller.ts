import { Controller, Get, Post, Req, Res, UseGuards, HttpException, Body, HttpCode, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DummyGoogleLoginDto, DummyMicrosoftLoginDto, LoginDto, LoginResponseDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { MicrosoftAuthDto } from './dto/microsoftAuth.dto';
import { GoogleAuthDto } from './dto/googleAuth.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { MicrosoftAuthService } from './microsoft-auth/microsoft-auth.service';
import { MeResponseDto } from './dto/meResponse.dto';
import { AccessTokenPayload } from './dto/accessToken.dto';
import { users } from 'src/generated/prisma/client';
import { UserDto } from 'src/users/dto/user.dto';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';


@Controller('auth')
export class AuthController {
    private authService: AuthService;
    private jwtService: JwtService;
    private googleAuthService: GoogleAuthService;
    private microsoftAuthService: MicrosoftAuthService;

    constructor(authService: AuthService, jwtService: JwtService, googleAuthService: GoogleAuthService, microsoftAuthService: MicrosoftAuthService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.googleAuthService = googleAuthService;
        this.microsoftAuthService = microsoftAuthService;
    }

    // ambil bearer, return user
    @UseGuards(AuthGuard('jwt'))
    @Get("/me")
    @ApiResponse({ type: MeResponseDto })
    async me(@Req() req): Promise<MeResponseDto> {
        // return this.authService.getHello();
        console.log("/me hit : " + req.user);

        const userMeta = req.user as AccessTokenPayload;

        const user = await this.authService.findUserById(userMeta.userId);
        if (!user) {
            throw new NotFoundException("User not found");
        }

        const googleUser = (user.google_email) ? await this.googleAuthService.getGoogleUserInfo(user.google_email) : null;
        const microsoftUser = (user.microsoft_email) ? await this.microsoftAuthService.getMicrosoftUser(user.microsoft_email) : null;

        return {
            google_email: user.google_email,
            microsoft_email: user.microsoft_email,
            userId: user.id,
            username: user.username!,
            googleUser: googleUser,
            microsoftUser: microsoftUser,
        }
    }

    //ambil user, return bearer
    @Post("/login")
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'User found', type: LoginResponseDto })
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res): Promise<LoginResponseDto> {
        const tokenPayload = await this.authService.login(loginDto);

        if (!tokenPayload) {
            throw new HttpException('Invalid credentials', 401);
        }

        const token = await this.jwtService.signAsync(tokenPayload);
        res.cookie('authorization', token, {
            httpOnly: true,
            expires: new Date(new Date().getTime() + 60 * 10 * 1000),
        });

        return { accessToken: token, google_email: tokenPayload.google_email, microsoft_email: tokenPayload.microsoft_email, userid: tokenPayload.userId, username: tokenPayload.username } as LoginResponseDto;
    }


    @Post("/register")
    @HttpCode(201)
    @ApiResponse({ status: 201, description: 'Register new user', type: RegisterResponseDto })
    async register(@Body() body: RegisterDto, @Res({ passthrough: true }) res): Promise<RegisterResponseDto> {
        try {
            const result = await this.authService.register(body);
            return { message: "Successfully create user with username " + body.username }
        } catch (err) {
            return { message: err.message }
        }
    }

    // NOTE : Ini gara2 gw daftarin di google console sebagai web, jadinya perlu PKCE manual
    @HttpCode(200)
    @Post("/google")
    @ApiResponse({ status: 200, description: 'User found', type: LoginResponseDto })
    async registerGoogleUser(@Body() body: GoogleAuthDto, @Req() req, @Res({ passthrough: true }) res): Promise<LoginResponseDto> {
        console.log("Google auth endpoint hit with body:", body);
        const googleAuthCode = body.authCode;
        const codeVerifier = body.codeVerifier;
        const redirectUri = body.redirectUri;
        if (!googleAuthCode || !codeVerifier || !redirectUri) {
            throw new HttpException("auth_code, code_verifier, and redirect_uri are required", 400);
        }
        let tokenPayload = await this.googleAuthService.authGoogleUser(googleAuthCode, codeVerifier, redirectUri);
        let token = await this.jwtService.signAsync(tokenPayload);
        res.cookie('authorization', token, {
            httpOnly: true,
            expires: new Date(new Date().getTime() + 60 * 10 * 1000),
        });
        return { accessToken: token, google_email: tokenPayload.google_email, microsoft_email: tokenPayload.microsoft_email, userid: tokenPayload.userId, username: tokenPayload.username } as LoginResponseDto;
    }

    @Post("/google/dummy")
    async dummyGoogleLogin(@Body() body: DummyGoogleLoginDto, @Res({ passthrough: true }) res): Promise<LoginResponseDto> {
        let tokenPayload = await this.authService.dummyAuthGoogleUser(body.email);
        let token = await this.jwtService.signAsync(tokenPayload);
        res.cookie('authorization', token, {
            httpOnly: true,
            expires: new Date(new Date().getTime() + 60 * 10 * 1000),
        });
        return { accessToken: token, google_email: tokenPayload.google_email, microsoft_email: tokenPayload.microsoft_email, userid: tokenPayload.userId, username: tokenPayload.username } as LoginResponseDto;
    }

    @Post("/microsoft/dummy")
    async dummyMicrosoftLogin(@Body() body: DummyMicrosoftLoginDto, @Res({ passthrough: true }) res): Promise<LoginResponseDto> {
        const tokenPayload = await this.authService.dummyAuthMicrosoftUser(body.email);
        const token = await this.jwtService.signAsync(tokenPayload);
        res.cookie('authorization', token, {
            httpOnly: true,
            expires: new Date(new Date().getTime() + 60 * 10 * 1000),
        });
        return { accessToken: token, google_email: tokenPayload.google_email, microsoft_email: tokenPayload.microsoft_email, userid: tokenPayload.userId, username: tokenPayload.username } as LoginResponseDto;
    }

    @HttpCode(200)
    @Post("/microsoft")
    @ApiOperation({ description: "Register NEW user with Microsoft OAuth2" })
    @ApiResponse({ status: 200, description: 'User found', type: LoginResponseDto })
    async registerMicrosoftUser(@Body() body: MicrosoftAuthDto, @Req() req, @Res({ passthrough: true }) res): Promise<LoginResponseDto> {
        console.log("Microsoft auth endpoint hit with body:", body);
        if (!body.code || !body.redirect_uri) {
            throw new HttpException("auth_code and redirect_uri are required", 400);
        }
        let tokenPayload = await this.microsoftAuthService.authMicrosoftUser(body.code, body.redirect_uri);
        let token = await this.jwtService.signAsync(tokenPayload);
        res.cookie('authorization', token, {
            httpOnly: true,
            expires: new Date(new Date().getTime() + 60 * 10 * 1000),
        });
        return { accessToken: token, google_email: tokenPayload.google_email, microsoft_email: tokenPayload.microsoft_email, userid: tokenPayload.userId, username: tokenPayload.username } as LoginResponseDto;
    }



    @HttpCode(200)
    @Post("/microsoft/bind")
    @ApiOperation({ description: "Bind Microsoft account to existing user" })
    @ApiResponse({ status: 200, description: 'User bound', type: MeResponseDto })
    @UseGuards(AuthGuard('jwt'))
    async bindMicrosoft(@Body() body: MicrosoftAuthDto, @Req() req, @Res({ passthrough: true }) res): Promise<MeResponseDto> {
        if (!body.code || !body.redirect_uri) {
            throw new HttpException("auth_code and redirect_uri are required", 400);
        }

        const userMeta = req.user as AccessTokenPayload;
        let updated = await this.microsoftAuthService.bindMicrosoftUser(userMeta.userId, body.code, body.redirect_uri);

        const googleUser = (updated.google_email) ? await this.googleAuthService.getGoogleUserInfo(updated.google_email) : null;
        const microsoftUser = (updated.microsoft_email) ? await this.microsoftAuthService.getMicrosoftUser(updated.microsoft_email) : null;
        return {
            google_email: updated.google_email,
            microsoft_email: updated.microsoft_email,
            userId: updated.id,
            username: updated.username!,
            googleUser: googleUser,
            microsoftUser: microsoftUser,
        }
    }

    @HttpCode(200)
    @Post("/google/bind")
    @ApiOperation({ description: "Bind Google account to existing user" })
    @ApiResponse({ status: 200, description: 'User bound', type: MeResponseDto })
    @UseGuards(AuthGuard('jwt'))
    async bindGoogle(@Body() body: GoogleAuthDto, @Req() req, @Res({ passthrough: true }) res): Promise<MeResponseDto> {
        if (!body.authCode || !body.codeVerifier || !body.redirectUri) {
            throw new HttpException("authCode, codeVerifier, and redirectUri are required", 400);
        }

        const userMeta = req.user as AccessTokenPayload;
        const updated = await this.googleAuthService.bindGoogleUser(userMeta.userId, body.authCode, body.codeVerifier, body.redirectUri);

        const googleUser = (updated.google_email) ? await this.googleAuthService.getGoogleUserInfo(updated.google_email) : null;
        const microsoftUser = (updated.microsoft_email) ? await this.microsoftAuthService.getMicrosoftUser(updated.microsoft_email) : null;

        return {
            google_email: updated.google_email,
            microsoft_email: updated.microsoft_email,
            userId: updated.id,
            username: updated.username!,
            googleUser: googleUser,
            microsoftUser: microsoftUser,
        }
    }

    @Get("register/google/callback")
    async googleAuthCallback(@Req() req, @Res() res) {
        console.log("Google auth callback hit with query:", req.query);
    }

}
