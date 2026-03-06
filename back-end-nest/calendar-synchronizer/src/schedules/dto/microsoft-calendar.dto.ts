export interface MicrosoftEmailAddress {
  name: string;
  address: string;
}

export interface MicrosoftEventBody {
  contentType: string;
  content: string;
}

export interface MicrosoftEventTime {
  dateTime: string;
  timeZone: string;
}

export interface MicrosoftLocation {
  displayName: string;
  locationType: string;
  uniqueIdType: string;
  address: Record<string, any>;
  coordinates: Record<string, any>;
}

export interface MicrosoftEventOrganizer {
  emailAddress: MicrosoftEmailAddress;
}

export interface MicrosoftEvent {
  '@odata.etag': string;
  id: string;
  subject: string;
  bodyPreview: string;
  body: MicrosoftEventBody;
  start: MicrosoftEventTime;
  end: MicrosoftEventTime;
  location: MicrosoftLocation;
  attendees: any[];
  organizer: MicrosoftEventOrganizer;
}

export interface MicrosoftCalendarResponse {
  '@odata.context': string;
  value: MicrosoftEvent[];
}