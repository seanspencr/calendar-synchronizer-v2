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
import { AiService } from 'src/ai/ai.service';
import { schedule_recurrences, schedules } from 'src/generated/prisma/client';
import { ScheduleDto } from './dto/schedule.dto';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

// ni supaya dia join dengan recurrences
const scheduleInclude = { schedule_recurrences: true } as const;

function toScheduleDto(s: schedules & { schedule_recurrences?: { recurrence_interval: number; recurrence_period: any } | null }): ScheduleDto {
  const rec = s.schedule_recurrences;
  return {
    ...s,
    recurrence: rec
      ? { recurrence_interval: rec.recurrence_interval, recurrence_period: rec.recurrence_period }
      : null,
  };
}



@Injectable()
export class SchedulesService {

  constructor(private databaseService: DatabaseService, private microsoftScheduleService: MicrosoftScheduleService, private googleScheduleService: GoogleScheduleService, private aiService: AiService) {

  }

  async create(createScheduleDto: CreateScheduleDto): Promise<ScheduleDto> {
    
    const toValidDate = (value: string | Date | null | undefined): Date | undefined => {
      if (!value) return undefined;
      const d = new Date(value);
      return isNaN(d.getTime()) ? undefined : d;
    };

    let recurrence : schedule_recurrences | undefined = undefined;

    if(createScheduleDto.recurrence && createScheduleDto.recurrence.recurrence_interval > 0 && createScheduleDto.recurrence.recurrence_period) {
      console.log("Creating schedule with recurrence: ", createScheduleDto.recurrence);
      recurrence = await this.databaseService.schedule_recurrences.create({
        data: {
          recurrence_interval: createScheduleDto.recurrence.recurrence_interval,
          recurrence_period: createScheduleDto.recurrence.recurrence_period,
          created_by: createScheduleDto.user_id,
        }
      })
    }

    return this.databaseService.schedules.create({
      data: {
        event: createScheduleDto.event,
        event_date: new Date(createScheduleDto.event_date),
        start_time: toValidDate(createScheduleDto.start_time),
        end_time: toValidDate(createScheduleDto.end_time),
        created_by: createScheduleDto.user_id,
        schedule_provider: createScheduleDto.schedule_provider,
        external_event_id: createScheduleDto.external_event_id,
        description: createScheduleDto.description,
        schedule_recurrence_id: recurrence ? recurrence.id : null
      },
      include: scheduleInclude,
    }).then(toScheduleDto);
  }

  upsertManyByExternalEventId(createScheduleDtos: CreateScheduleDto[]): Promise<ScheduleDto[]> {
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
            description: dto.description,
          },
          create: {
            event: dto.event,
            event_date: new Date(dto.event_date),
            start_time: dto.start_time,
            end_time: dto.end_time,
            created_by: dto.user_id,
            schedule_provider: dto.schedule_provider,
            external_event_id: dto.external_event_id,
            description: dto.description,
          },
        }).then(s => ({ ...s, recurrence: null }))
      })
    );
  }

  findAll(userId: string): Promise<ScheduleDto[]> {
    return this.databaseService.schedules.findMany({
      where: { created_by: userId },
      include: scheduleInclude,
    }).then(rows => rows.map(toScheduleDto));
  }

  findByDateRange(userId: string, minDate?: string, maxDate?: string): Promise<ScheduleDto[]> {
    return this.databaseService.schedules.findMany({
      where: {
        created_by: userId,
      },
      orderBy: { event_date: 'asc' },
      include: scheduleInclude,
    }).then(rows => {
      const expanded: ScheduleDto[] = [];

      const rangeStart = minDate ? new Date(minDate) : null;
      const rangeEnd = maxDate ? new Date(maxDate) : null;

      for (const row of rows) {
        const base = toScheduleDto(row);
        const recurrence = row.schedule_recurrences;

        // If no recurrence, only include if event_date is within range
        if (!recurrence?.recurrence_interval || !recurrence?.recurrence_period) {
          const eventDate = new Date(row.event_date);
          const inRange =
            (!rangeStart || eventDate >= rangeStart) &&
            (!rangeEnd || eventDate <= rangeEnd);
          if (inRange) expanded.push(base);
          continue;
        }

        const { recurrence_interval, recurrence_period } = recurrence;

        // Walk from the original event_date forward, collecting hits within range
        let current = new Date(row.event_date);

        while (!rangeEnd || current <= rangeEnd) {
          const inRange =
            (!rangeStart || current >= rangeStart) &&
            (!rangeEnd || current <= rangeEnd);

          if (inRange) {
            expanded.push({
              ...base,
              event_date: current,
            });
          }

          // Advance
          switch (recurrence_period) {
            case 'DAY':   current = addDays(current, recurrence_interval);   break;
            case 'WEEK':  current = addWeeks(current, recurrence_interval);  break;
            case 'MONTH': current = addMonths(current, recurrence_interval); break;
            case 'YEAR':  current = addYears(current, recurrence_interval);  break;
            default: break;
          }

          // Safety: if no recurrence match advances, break to avoid infinite loop
          if (!['DAY','WEEK','MONTH','YEAR'].includes(recurrence_period)) break;
        }
      }

      expanded.sort((a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      );

      return expanded;
    });
}
  findOne(id: string): Promise<ScheduleDto | null> {
    return this.databaseService.schedules.findUnique({
      where: { id },
      include: scheduleInclude,
    }).then(s => s ? toScheduleDto(s) : null);
  }

  update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<ScheduleDto> {
    return this.databaseService.schedules.update({
      where: { id },
      data: {
        event: updateScheduleDto.event,
        event_date: updateScheduleDto.event_date ? new Date(updateScheduleDto.event_date) : undefined,
        start_time: updateScheduleDto.start_time ? new Date(updateScheduleDto.start_time) : undefined,
        end_time: updateScheduleDto.end_time ? new Date(updateScheduleDto.end_time) : undefined,
        description: updateScheduleDto.description,
      },
      include: scheduleInclude,
    }).then(toScheduleDto);
  }

  remove(id: string): Promise<ScheduleDto | null> {
    return this.databaseService.schedules.delete({
      where: { id },
      include: scheduleInclude,
    }).then(toScheduleDto);
  }

  async syncMicrosoftEvents(issuer: AccessTokenPayload): Promise<ScheduleDto[]> {
    console.log("Syncing Microsoft Events for user: ", issuer.microsoft_email);

    if (!issuer.microsoft_email) {
      return [];
    }

    let microsoftCalendarEvents = await this.microsoftScheduleService.getMicrosoftCalendarEvents(issuer.microsoft_email);

    let createScheduleDtos: CreateScheduleDto[] = microsoftCalendarEvents.map((event: MicrosoftEvent) => {
      return {
        event: event.subject,
        event_date: convertToUTC(new Date(event.start.dateTime), event.start.timeZone),
        start_time: convertToUTC(new Date(event.start.dateTime), event.start.timeZone),
        end_time: convertToUTC(new Date(event.end.dateTime), event.end.timeZone),
        schedule_provider: schedule_provider.MICROSOFT,
        user_id: issuer.userId,
        external_event_id: event.id,
        description: event.body?.content ?? null,
        recurrence: null, // external event ga kita ambil recurrencenya
      }
    });

    return await this.upsertManyByExternalEventId(createScheduleDtos);
  }

  async syncGoogleEvents(issuer: AccessTokenPayload): Promise<ScheduleDto[]> {
    console.log("Syncing Google Events for user: ", issuer.google_email, " and userId: ", issuer.userId);
    if (!issuer.google_email) {
      return [];
    }
    let googleEvents: GoogleCalendarEventsNormalized[] = await this.googleScheduleService.getGoogleCalendarEvents(issuer.google_email);

    let createScheduleDtos: CreateScheduleDto[] = googleEvents.map((event: GoogleCalendarEventsNormalized) => {
      const domainEvent: Partial<CreateScheduleDto> = {
        user_id: issuer.userId,
        schedule_provider: schedule_provider.GOOGLE,
        event: event.summary,
        description: event.description ?? null,
        recurrence: null, // external event ga kita ambil recurrencenya
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
