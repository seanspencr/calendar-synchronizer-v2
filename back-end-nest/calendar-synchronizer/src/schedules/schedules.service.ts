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
import { schedules } from 'src/generated/prisma/client';
import { ScheduleDto } from './dto/schedule.dto';

const scheduleInclude = { schedule_recurrences: true } as const;

function toScheduleDto(s: schedules & { schedule_recurrences?: { recurrence_interval: bigint; recurrence_period: any } | null }): ScheduleDto {
  const rec = s.schedule_recurrences;
  return {
    ...s,
    recurrence: rec
      ? { recurrence_interval: Number(rec.recurrence_interval), recurrence_period: rec.recurrence_period }
      : null,
  };
}



@Injectable()
export class SchedulesService {

  constructor(private databaseService: DatabaseService, private microsoftScheduleService: MicrosoftScheduleService, private googleScheduleService: GoogleScheduleService, private aiService: AiService) {

  }

  create(createScheduleDto: CreateScheduleDto): Promise<ScheduleDto> {
    return this.databaseService.schedules.create({
      data: {
        event: createScheduleDto.event,
        event_date: new Date(createScheduleDto.event_date),
        start_time: createScheduleDto.start_time ? new Date(createScheduleDto.start_time) : undefined,
        end_time: createScheduleDto.end_time ? new Date(createScheduleDto.end_time) : undefined,
        created_by: createScheduleDto.user_id,
        schedule_provider: createScheduleDto.schedule_provider,
        external_event_id: createScheduleDto.external_event_id,
        description: createScheduleDto.description
      },
      include: scheduleInclude,
    }).then(toScheduleDto);
  }

  async createWithNaturalLanguage(query: string, issuer: AccessTokenPayload) {
    const now = new Date().toISOString();
    const basePrompt = `You are a scheduling assistant. Parse the following natural language input and convert it into a JSON object with these exact fields:

{
  "event": "string — the name/title of the event",
  "event_date": "ISO 8601 date string (e.g. 2025-03-06T00:00:00.000Z) — the date the event occurs",
  "start_time": "ISO 8601 datetime string with date portion set to 1970-01-01 (e.g. 1970-01-01T09:00:00.000Z) — the start time in UTC",
  "end_time": "ISO 8601 datetime string with date portion set to 1970-01-01 (e.g. 1970-01-01T17:00:00.000Z) — the end time in UTC",
  "schedule_provider": "LOCAL"
}

Rules:
- All times must be in UTC (Z suffix).
- For start_time and end_time, always use 1970-01-01 as the date portion and only vary the time.
- For event_date, use the actual date of the event with time set to 00:00:00.000Z.
- If no specific time is mentioned, use reasonable defaults (e.g. 09:00 - 10:00 UTC).
- If no specific date is mentioned, assume today's date: ${now}.
- schedule_provider must always be "LOCAL".
- Return ONLY the JSON object, no additional text.

Natural language input: "${query}"`;

    const aiResponseText = await this.aiService.queryLmForJson(basePrompt);

    let parsed: any;
    try {
      parsed = JSON.parse(aiResponseText);
    } catch {
      throw new Error(`Failed to parse AI response as JSON: ${aiResponseText}`);
    }

    const createScheduleDto = new CreateScheduleDto();
    createScheduleDto.event = parsed.event ?? null;
    createScheduleDto.event_date = new Date(parsed.event_date);
    createScheduleDto.start_time = new Date(parsed.start_time);
    createScheduleDto.end_time = new Date(parsed.end_time);
    createScheduleDto.user_id = issuer.userId;
    createScheduleDto.schedule_provider = (parsed.schedule_provider as schedule_provider) ?? schedule_provider.LOCAL;
    createScheduleDto.external_event_id = null;
    createScheduleDto.description = parsed.description ?? null;

    return this.databaseService.schedules.create({
      data: {
        event: createScheduleDto.event,
        event_date: new Date(createScheduleDto.event_date),
        start_time: createScheduleDto.start_time,
        end_time: createScheduleDto.end_time,
        created_by: createScheduleDto.user_id,
        schedule_provider: createScheduleDto.schedule_provider,
        external_event_id: createScheduleDto.external_event_id,
        description: createScheduleDto.description,
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
        event_date: {
          ...(minDate ? { gte: new Date(minDate) } : {}),
          ...(maxDate ? { lte: new Date(maxDate) } : {}),
        },
      },
      orderBy: { event_date: 'asc' },
      include: scheduleInclude,
    }).then(rows => rows.map(toScheduleDto));
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
