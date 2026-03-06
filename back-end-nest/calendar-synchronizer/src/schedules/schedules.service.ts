import { Injectable, UseGuards } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AccessTokenPayload } from 'src/auth/dto/accessToken.dto';
import { MicrosoftScheduleService } from './microsoft-schedule/microsoft-schedule.service';
import { GoogleScheduleService } from './google-schedule/google-schedule.service';
import { DatabaseService } from 'src/database/database.service';
import { MicrosoftEvent } from './dto/microsoft-calendar.dto';
import { convertToUTC } from 'src/lib/timezone';
import { schedule_provider } from 'src/generated/prisma/enums';

@Injectable()
export class SchedulesService {

  constructor(private databaseService: DatabaseService, private microsoftScheduleService: MicrosoftScheduleService, private googleScheduleService: GoogleScheduleService) {

  }

  create(createScheduleDto: CreateScheduleDto) {
    return 'This action adds a new schedule';
  }

  upsertMany(createScheduleDtos: CreateScheduleDto[]) {
    return Promise.all(
    createScheduleDtos.map((dto : CreateScheduleDto) =>
      this.databaseService.schedules.upsert({
        where: {
          id: dto.id || '', // Use external event ID or unique identifier
        },
        update: {
          event: dto.event,
          event_date: new Date(dto.event_date),
          start_time: dto.start_time,
          end_time: dto.end_time,
        },
        create: {
          event: dto.event,
          event_date: new Date(dto.event_date),
          start_time: dto.start_time,
          end_time: dto.end_time,
          created_by: dto.user_id,
          schedule_provider: dto.schedule_provider,
        },
      })
    )
  );
  }

  findAll() {
    return `This action returns all schedules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }

  async syncMicrosoftEvents(issuer: AccessTokenPayload){
    console.log("Syncing Microsoft Events for user: ", issuer.email);

    let microsoftCalendarEvents = await this.microsoftScheduleService.getMicrosoftCalendarEvents(issuer.email);

    let createScheduleDtos : CreateScheduleDto[] = microsoftCalendarEvents.value.map((event : MicrosoftEvent) => {
      return {
        id: undefined,
        event: event.subject,
        event_date: convertToUTC(new Date(event.start.dateTime), event.start.timeZone),
        start_time: convertToUTC(new Date(event.start.dateTime), event.start.timeZone),
        end_time: convertToUTC(new Date(event.end.dateTime), event.end.timeZone),
        schedule_provider: schedule_provider.MICROSOFT,
        user_id: issuer.email
      }
    });
    
    return await this.upsertMany(createScheduleDtos);
  }

  async syncGoogleEvents(issuer: AccessTokenPayload){
    console.log("Syncing Google Events for user: ", issuer.email);
    let googleEvents = await this.googleScheduleService.getGoogleCalendarEvents(issuer.email);
    return googleEvents;
  }

}
