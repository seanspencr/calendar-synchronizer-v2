export interface GoogleUser {
email: string;
self: boolean;
}

// export interface GoogleUntimedEventResponse {
//     kind: string;
//     summary: string;
//     start: {
//         date: string;
//     };
//     end: {
//         date: string;
//     }
// }

// export interface GoogleCalendarTimedResponse {
//     kind: string;
//     summary: string;
//     start : {
//         dateTime : string;
//         timeZone : string;
//     };
//     end : {
//         dateTime : string;
//         timeZone : string;
//     }
// }

export interface GoogleCalendarEventsNormalized {
    id : string;
    kind : string;
    summary : string;
    description?: string;
    start : {
        date : string;
        dateTime : string;
        timeZone : string;
    };
    end : {
        date : string;
        dateTime : string;
        timeZone : string;
    }
}


export interface GoogleCalendarIdResponse{
    kind : string;
    id : string
}

