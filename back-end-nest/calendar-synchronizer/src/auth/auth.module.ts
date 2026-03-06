import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from "../jwt/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { DatabaseModule } from "../database/database.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { jwtConfig } from 'src/lib/jwt_config';
import { MicrosoftAuthService } from './microsoft-auth/microsoft-auth.service';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { Client } from '@microsoft/microsoft-graph-client';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    JwtModule.registerAsync(jwtConfig),
    PassportModule,
    UsersModule
  ],
  providers: [AuthService, JwtStrategy, MicrosoftAuthService, GoogleAuthService],
  exports: [AuthService, MicrosoftAuthService, GoogleAuthService],
  controllers: [AuthController],
})
export class AuthModule {}