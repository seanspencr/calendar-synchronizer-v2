import { Injectable } from '@nestjs/common';
import { GoogleCalendarEvent } from '../dto/google-calendar-dto';

@Injectable()
export class GoogleScheduleService {

    async getGoogleCalendarEvents(token: string) : Promise<GoogleCalendarEvent[]> {
        throw new Error("Not implemented");
    }

    
}
