import { Controller, Get, Post, Req, Res, UseGuards, HttpException, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DummyGoogleLoginDto, DummyMicrosoftLoginDto, LoginDto, LoginResponseDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { MicrosoftAuthDto } from './dto/microsoftAuth.dto';
import { GoogleAuthDto } from './dto/googleAuth.dto';
import { ApiResponse } from '@nestjs/swagger';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { MicrosoftAuthService } from './microsoft-auth/microsoft-auth.service';


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
    me(@Req() req) {
        // return this.authService.getHello();
        console.log("/me hit : " + req.user);
        return req.user;
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

        return { accessToken: token, email: tokenPayload.email, userid: tokenPayload.userId, username: tokenPayload.username } as LoginResponseDto;
    }

    // NOTE : Ini gara2 gw daftarin di google console sebagai web, jadinya perlu PKCE manual
    @HttpCode(200)
    @Post("/google")
    @ApiResponse({ status: 200, description: 'User found', type: LoginResponseDto })
    async registerGoogleUser(@Body() body: GoogleAuthDto, @Req() req, @Res({ passthrough: true }) res): Promise<LoginResponseDto> {
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
        return { accessToken: token, email: tokenPayload.email, userid: tokenPayload.userId, username: tokenPayload.username } as LoginResponseDto;
    }

    @Post("/google/dummy")
    async dummyGoogleLogin(@Body() body: DummyGoogleLoginDto, @Res({ passthrough: true }) res): Promise<LoginResponseDto> {
        let tokenPayload = await this.authService.dummyAuthGoogleUser(body.email);
        let token = await this.jwtService.signAsync(tokenPayload);
        res.cookie('authorization', token, {
            httpOnly: true,
            expires: new Date(new Date().getTime() + 60 * 10 * 1000),
        });
        return { accessToken: token, email: tokenPayload.email, userid: tokenPayload.userId, username: tokenPayload.username } as LoginResponseDto;
    }

    @Post("/microsoft/dummy")
    async dummyMicrosoftLogin(@Body() body: DummyMicrosoftLoginDto, @Res({ passthrough: true }) res): Promise<LoginResponseDto> {
        const tokenPayload = await this.authService.dummyAuthMicrosoftUser(body.email);
        const token = await this.jwtService.signAsync(tokenPayload);
        res.cookie('authorization', token, {
            httpOnly: true,
            expires: new Date(new Date().getTime() + 60 * 10 * 1000),
        });
        return { accessToken: token, email: tokenPayload.email, userid: tokenPayload.userId, username: tokenPayload.username } as LoginResponseDto;
    }

    @HttpCode(200)
    @Post("/microsoft")
    @ApiResponse({ status: 200, description: 'User found', type: LoginResponseDto })
    async registerMicrosoftUser(@Body() body: MicrosoftAuthDto, @Req() req, @Res({ passthrough: true }) res): Promise<LoginResponseDto> {
        if (!body.code || !body.redirect_uri) {
            throw new HttpException("auth_code and redirect_uri are required", 400);
        }
        let tokenPayload = await this.microsoftAuthService.authMicrosoftUser(body.code, body.redirect_uri);
        let token = await this.jwtService.signAsync(tokenPayload);
        res.cookie('authorization', token, {
            httpOnly: true,
            expires: new Date(new Date().getTime() + 60 * 10 * 1000),
        });
        return { accessToken: token, email: tokenPayload.email, userid: tokenPayload.userId, username: tokenPayload.username } as LoginResponseDto;
    }

    @Get("register/google/callback")
    async googleAuthCallback(@Req() req, @Res() res) {
        console.log("Google auth callback hit with query:", req.query);
    }

}
