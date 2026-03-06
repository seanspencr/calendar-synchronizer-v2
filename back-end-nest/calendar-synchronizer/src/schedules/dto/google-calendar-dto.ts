   export interface GoogleUser {
  email: string;
  self: boolean;
}

export interface GoogleEventTime {
  dateTime: string;
  timeZone: string;
}

export interface GoogleEventReminders {
  useDefault: boolean;
}

export interface GoogleCalendarEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  colorId: string;
  creator: GoogleUser;
  organizer: GoogleUser;
  start: GoogleEventTime;
  end: GoogleEventTime;
  iCalUID: string;
  sequence: number;
  reminders: GoogleEventReminders;
  eventType: string;
}