import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { MicrosoftScheduleService } from './microsoft-schedule/microsoft-schedule.service';
import { GoogleScheduleService } from './google-schedule/google-schedule.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/lib/jwt_config';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [SchedulesController],
  providers: [SchedulesService, MicrosoftScheduleService, GoogleScheduleService, JwtStrategy],
})
export class SchedulesModule { }
