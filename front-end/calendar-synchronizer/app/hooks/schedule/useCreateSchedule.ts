import { useState, useCallback } from 'react';
import type { CreateScheduleFormData } from '../../components/create-dialog/types';
import { ScheduleService } from '../../services/scheduleService';
import { CreateScheduleDto } from '../../api-client';

/**
 * Creates a new schedule.
 * Replace with real API call: POST /schedules
 */
export function useCreateSchedule() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createSchedule = useCallback(async (data: CreateScheduleFormData, userId: string) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      console.log('[useCreateSchedule] Schedule created:', data);

      let isoEventDate = data.event_date;
      let isoStartTime = data.start_time;
      let isoEndTime = data.end_time;

      try {
        if (data.event_date) {
          isoEventDate = new Date(data.event_date).toISOString();
        }
        if (data.event_date && data.start_time) {
          isoStartTime = new Date(`${data.event_date}T${data.start_time}`).toISOString();
        }
        if (data.event_date && data.end_time) {
          isoEndTime = new Date(`${data.event_date}T${data.end_time}`).toISOString();
        }
      } catch (e) {
        console.warn('Failed to parse dates to ISO strings', e);
      }

      const dto: CreateScheduleDto = {
        event: data.event,
        description: data.description || undefined,
        event_date: isoEventDate,
        start_time: isoStartTime,
        end_time: isoEndTime,
        schedule_provider: data.schedule_provider,
        user_id: userId,
      };

      await ScheduleService.createSchedule(dto);
      setSuccessMessage(`Schedule "${data.event}" created successfully.`);
    } catch {
      setError('Failed to create schedule.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { createSchedule, isSubmitting, error, successMessage };
}
