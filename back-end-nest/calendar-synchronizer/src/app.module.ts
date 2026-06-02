import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SchedulesModule } from './schedules/schedules.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from "@nestjs/config";
import { TasksModule } from './tasks/tasks.module';
import { AiModule } from './ai/ai.module';
import { MessagesModule } from './messages/messages.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
    }),
    UsersModule,
    SchedulesModule,
    AuthModule,
    DatabaseModule,
    TasksModule,
    AiModule,
    MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
