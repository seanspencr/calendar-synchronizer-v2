/**
 * Types for the Create dialog forms.
 * Based on CreateTaskDto and the backend ScheduleDto schema.
 */

import { RecurrenceDtoRecurrencePeriodEnum } from "@/app/api-client/api";

/** Form data for creating a new task */
export interface CreateTaskFormData {
  title: string;
  description: string;
  deadline: string;
  parent_task_id?: string;
}

/** Schedule provider options */
export type ScheduleProvider = 'LOCAL' | 'MICROSOFT' | 'GOOGLE';

/** Form data for creating a new schedule */
export interface CreateScheduleFormData {
  event: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  schedule_provider: ScheduleProvider;
  recurrence_interval: number;
  recurrence_period:  RecurrenceDtoRecurrencePeriodEnum;
}

/** Which form is active in the create dialog */
export type CreateDialogMode = 'task' | 'schedule';
