export function convertToUTC(date: Date, timezone: string): Date {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const offset = tzDate.getTime() - utcDate.getTime();
    return new Date(date.getTime() - offset);
}

export function convertToTimezone(date: Date, timezone: string): Date {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const offset = tzDate.getTime() - utcDate.getTime();
    return new Date(date.getTime() + offset);
}