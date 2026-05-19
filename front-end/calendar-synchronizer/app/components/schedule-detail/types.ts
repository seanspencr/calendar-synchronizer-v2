/**
 * Types for the Schedule Detail page.
 * Extends the base ScheduleDto with recurrence information for display and editing.
 */

import type { ScheduleDto } from '../dashboard/types';

/** Recurrence interval options */
export type RecurrenceInterval =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'none';

/** Extended schedule with recurrence info for the detail view */
export interface ScheduleDetailDto extends ScheduleDto {
  recurrenceInterval: RecurrenceInterval;
  recurrenceCount?: number; // e.g. repeat every N intervals
}

/** Editable fields exposed by the edit form */
export interface ScheduleEditFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  recurrenceInterval: RecurrenceInterval;
  recurrenceCount: number;
}

/** Labels for recurrence intervals */
export const RECURRENCE_LABELS: Record<RecurrenceInterval, string> = {
  none: 'None',
  daily: 'Day',
  weekly: 'Week',
  biweekly: 'Biweek',
  monthly: 'Month',
  quarterly: 'Quarter',
  yearly: 'Year',
};
