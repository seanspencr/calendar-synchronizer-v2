import { Injectable } from '@nestjs/common';
import { GoogleCalendarEventsNormalized, GoogleCalendarIdResponse } from '../dto/google-calendar-dto';
import { GoogleAuthService } from 'src/auth/google-auth/google-auth.service';
import axios from 'axios';

@Injectable()
export class GoogleScheduleService {

    constructor(private googleAuthService: GoogleAuthService) { }

    applyGoogleEventIdPrefix(eventId: string): string {
        return `google-${eventId}`;
    }

    async getGoogleCalendarEvents(email: string): Promise<GoogleCalendarEventsNormalized[]> {
        const accessToken = await this.googleAuthService.getGoogleAccessToken(email);

        if (!accessToken) {
            throw new Error("Failed to get Google access token");
        }

        const calendarIds: GoogleCalendarIdResponse[] = await this.getGoogleCalendarIds(email);

        const now = new Date();
        const timeMin = now.toISOString();
        const timeMax = new Date(new Date().setFullYear(now.getFullYear() + 1)).toISOString();

        const eventsPromises = calendarIds.map(async (calendar) => {
            try {
                const encodedCalendarId = encodeURIComponent(calendar.id);
                const response = await axios.get(
                    `https://www.googleapis.com/calendar/v3/calendars/${encodedCalendarId}/events?singleEvents=true&orderBy=startTime&fields=items(id,summary,description,start,end)&timeMin=${timeMin}&timeMax=${timeMax}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                return response.data.items as GoogleCalendarEventsNormalized[];
            } catch (error) {
                throw new Error(`Google Calendar API error: ${error.response?.data?.error?.message || error.message}`);
            }
        })
        const results = await Promise.all(eventsPromises);
        return results.flat();
    }

    async getGoogleCalendarIds(email: string): Promise<GoogleCalendarIdResponse[]> {
        let url = "https://www.googleapis.com/calendar/v3/users/me/calendarList?fields=items(kind,id)";

        const accessToken = await this.googleAuthService.getGoogleAccessToken(email);

        try {
            let response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            })

            return response.data.items
                .filter((item: any) => item.kind === 'calendar#calendarListEntry')
                .map((item: any) => ({
                    kind: item.kind,
                    id: item.id
                }))
                .filter((item): item is GoogleCalendarIdResponse => !!item.id);


        } catch (error) {
            throw new Error(`Google Calendar API error: ${error.response?.data?.error?.message || error.message}`);
        }
    }


}
