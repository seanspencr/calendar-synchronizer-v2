import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { AiService } from 'src/ai/ai.service';
import { AiModule } from 'src/ai/ai.module';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [AiModule, SchedulesModule, TasksModule, DatabaseModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule { }
