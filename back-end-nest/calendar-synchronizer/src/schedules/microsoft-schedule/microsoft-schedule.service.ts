import { Injectable } from '@nestjs/common';
import { MicrosoftCalendar, MicrosoftEvent, MicrosoftGetCalendarsResponse, MicrosoftGetEventResponse } from '../dto/microsoft-calendar.dto';
import { MicrosoftAuthService } from 'src/auth/microsoft-auth/microsoft-auth.service';
import { Client } from '@microsoft/microsoft-graph-client/lib/src/Client';
import { ApiConsumes } from '@nestjs/swagger';
import axios from 'axios';

@Injectable()
export class MicrosoftScheduleService {

    constructor(private microsoftAuthService: MicrosoftAuthService) { }


    async getMicrosoftCalendars(accessToken: string): Promise<MicrosoftGetCalendarsResponse> {

        const client = this.microsoftAuthService.getAuthenticatedClient(accessToken);
        let calendars = await client.api('/me/calendars')
            .select('id')
            .get();
        console.log("Microsoft calendars response:", calendars);
        return calendars;
    }

    async getMicrosoftCalendarEvents(email: string): Promise<MicrosoftEvent[]> {
        const accessToken = await this.microsoftAuthService.getMicrosoftAccessToken(email);

        if (!accessToken) {
            throw new Error("Failed to get Microsoft access token");
        } else {
            console.log("Microsoft access token:", accessToken);
        }

        let calendars: MicrosoftGetCalendarsResponse = await this.getMicrosoftCalendars(accessToken);

        const events = await Promise.all(
            calendars.value.map(async (calendar: MicrosoftCalendar) => {
                let url = `https://graph.microsoft.com/v1.0/me/calendars/${calendar.id}/calendarView?startDateTime=2026-03-07T00:00:00Z&endDateTime=2026-04-07T00:00:00Z&$select=id,subject,body,start,end`
                let response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                return response.data as MicrosoftGetEventResponse;
            }));

        console.log("Microsoft calendar events response:", events);
        return events.flat().map((eventResponse: MicrosoftGetEventResponse) => eventResponse.value).flat();


        // const client = this.microsoftAuthService.getAuthenticatedClient(accessToken);
        // let events = await client.api('/me/events')
        //             .select('subject,body,bodyPreview,organizer,attendees,start,end,location')
        //             .get();
        // console.log("Microsoft calendar events response:", events);
        // return events;


        // return fetch("https://graph.microsoft.com/v1.0/me/events?$select=subject,body,bodyPreview,organizer,attendees,start,end,location", {
        //     "headers": {
        //         "accept": "*/*",
        //         "accept-language": "en-US,en;q=0.9",
        //         "authorization": `Bearer ${accessToken}`,
        //         "cache-control": "no-cache",
        //         "client-request-id": "be2daa23-2647-0f23-8f1e-ae1d4eff6351",
        //         "pragma": "no-cache",
        //         "prefer": "ms-graph-dev-mode",
        //         "priority": "u=1, i",
        //         "sdkversion": "GraphExplorer/4.0, graph-js/3.0.7 (featureUsage=6)",
        //         "sec-ch-ua": "\"Not:A-Brand\";v=\"99\", \"Brave\";v=\"145\", \"Chromium\";v=\"145\"",
        //         "sec-ch-ua-mobile": "?0",
        //         "sec-ch-ua-platform": "\"Windows\"",
        //         "sec-fetch-dest": "empty",
        //         "sec-fetch-mode": "cors",
        //         "sec-fetch-site": "same-site",
        //         "sec-gpc": "1",
        //         "Referer": "https://developer.microsoft.com/"
        //     },
        //     "body": null,
        //     "method": "GET"
        // }).then(res => {
        //     let data = res.json();
        //     console.log("Microsoft calendar events response:", data)
        //     return data
        // });
    }
}
