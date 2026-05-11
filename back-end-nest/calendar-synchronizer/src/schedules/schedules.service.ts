import { Injectable, UseGuards } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { AccessTokenPayload } from 'src/auth/dto/accessToken.dto';
import { MicrosoftScheduleService } from './microsoft-schedule/microsoft-schedule.service';
import { GoogleScheduleService } from './google-schedule/google-schedule.service';
import { DatabaseService } from 'src/database/database.service';
import { MicrosoftEvent, MicrosoftGetEventResponse } from './dto/microsoft-calendar.dto';
import { convertToUTC } from 'src/lib/timezone';
import { schedule_provider } from 'src/generated/prisma/enums';
import { GoogleCalendarEventsNormalized } from './dto/google-calendar-dto';

@Injectable()
export class SchedulesService {

  constructor(private databaseService: DatabaseService, private microsoftScheduleService: MicrosoftScheduleService, private googleScheduleService: GoogleScheduleService) {

  }

  create(createScheduleDto: CreateScheduleDto) {
    return 'This action adds a new schedule';
  }

  upsertManyByExternalEventId(createScheduleDtos: CreateScheduleDto[]) {
    return Promise.all(
      createScheduleDtos.map((dto: CreateScheduleDto) => {
        console.log("Upserting schedule : ", dto.external_event_id, " from provider: ", dto.schedule_provider);
        return this.databaseService.schedules.upsert({
          where: {
            external_event_id_schedule_provider: {
              external_event_id: dto.external_event_id!,
              schedule_provider: dto.schedule_provider!,
            }
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
            external_event_id: dto.external_event_id,
          },
        })
      }
      )
    );
  }

  findAll(userId: string) {
    // TODO : query juga schedula recurrences
    return this.databaseService.schedules.findMany({
      where: {
        created_by: userId
      }
    });
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

  async syncMicrosoftEvents(issuer: AccessTokenPayload) {
    console.log("Syncing Microsoft Events for user: ", issuer.email);

    let microsoftCalendarEvents = await this.microsoftScheduleService.getMicrosoftCalendarEvents(issuer.email);

    let createScheduleDtos: CreateScheduleDto[] = microsoftCalendarEvents.map((event: MicrosoftEvent) => {
      return {
        event: event.subject,
        event_date: convertToUTC(new Date(event.start.dateTime), event.start.timeZone),
        start_time: convertToUTC(new Date(event.start.dateTime), event.start.timeZone),
        end_time: convertToUTC(new Date(event.end.dateTime), event.end.timeZone),
        schedule_provider: schedule_provider.MICROSOFT,
        user_id: issuer.userId,
        external_event_id: event.id,
      }
    });

    return await this.upsertManyByExternalEventId(createScheduleDtos);
  }

  async syncGoogleEvents(issuer: AccessTokenPayload) {
    console.log("Syncing Google Events for user: ", issuer.email, " and userId: ", issuer.userId);
    let googleEvents: GoogleCalendarEventsNormalized[] = await this.googleScheduleService.getGoogleCalendarEvents(issuer.email);

    let createScheduleDtos: CreateScheduleDto[] = googleEvents.map((event: GoogleCalendarEventsNormalized) => {
      const domainEvent: Partial<CreateScheduleDto> = {
        user_id: issuer.userId,
        schedule_provider: schedule_provider.GOOGLE,
        event: event.summary,
      }

      if (!event.start.dateTime || !event.end.dateTime) {
        domainEvent.event_date = event.start.date
      } else {
        domainEvent.event_date = event.start.dateTime;
        domainEvent.start_time = convertToUTC(new Date(event.start.dateTime), event.start.timeZone);
        domainEvent.end_time = convertToUTC(new Date(event.end.dateTime), event.end.timeZone);
      }

      domainEvent.external_event_id = event.id;

      return domainEvent as CreateScheduleDto;
    })

    console.log("Google Events to be upserted: ", createScheduleDtos);

    return await this.upsertManyByExternalEventId(createScheduleDtos);
  }

}
