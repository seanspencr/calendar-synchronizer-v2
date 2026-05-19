import { useState, useCallback } from 'react';
import type { CreateScheduleFormData } from '../components/create-dialog/types';

/**
 * Creates a new schedule.
 * Replace with real API call: POST /schedules
 */
export function useCreateSchedule() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createSchedule = useCallback(async (data: CreateScheduleFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
      console.log('[useCreateSchedule] Schedule created:', data);
      setSuccessMessage(`Schedule "${data.event}" created successfully.`);
    } catch {
      setError('Failed to create schedule.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { createSchedule, isSubmitting, error, successMessage };
}
