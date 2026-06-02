

export interface MicrosoftEventBody {
  contentType: string;
  content: string;
}

export interface MicrosoftEventTime {
  dateTime: string;
  timeZone: string;
}


export interface MicrosoftEvent {
  '@odata.etag': string;
  id: string;
  subject: string;
  bodyPreview: string;
  body: MicrosoftEventBody;
  start: MicrosoftEventTime;
  end: MicrosoftEventTime;
}

export interface MicrosoftGetEventResponse {
  '@odata.context': string;
  value: MicrosoftEvent[];
}

export interface MicrosoftGetCalendarsResponse {
  '@odata.context': string;
  value: MicrosoftCalendar[];
}

export interface MicrosoftCalendar {
  id: string;
}