/**
 * Types for the Schedule Detail page.
 * Aligned with the backend ScheduleDto fields.
 */

import type { ScheduleDto } from '../../api-client';

// Re-export ScheduleDto for consumers of this module
export type { ScheduleDto };

/** Recurrence period unit as defined in the backend */
export type RecurrencePeriod = 'NONE' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

/** Editable fields exposed by the edit form */
export interface ScheduleEditFormData {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  /** How many units between recurrences (e.g. every 2 weeks → 2). */
  recurrenceInterval: number;
  /** The unit of recurrence */
  recurrencePeriod: RecurrencePeriod;
}

/** Display labels for each recurrence period */
export const RECURRENCE_PERIOD_LABELS: Record<RecurrencePeriod, string> = {
  NONE: 'None',
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year',
};
