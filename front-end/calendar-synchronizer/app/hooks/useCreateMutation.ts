import { useState, useCallback } from 'react';
import type {
  CreateTaskFormData,
  CreateScheduleFormData,
} from '../components/create-dialog/types';

export interface UseCreateMutationReturn {
  /** Submit a new task (dummy — logs and resolves) */
  createTask: (data: CreateTaskFormData) => Promise<void>;
  /** Submit a new schedule (dummy — logs and resolves) */
  createSchedule: (data: CreateScheduleFormData) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  /** Last success message (cleared on next submit) */
  successMessage: string | null;
}

/**
 * Dummy mutation hook for creating tasks and schedules.
 * Replace with real API calls to TasksApi / SchedulesApi.
 */
export function useCreateMutation(): UseCreateMutationReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createTask = useCallback(async (data: CreateTaskFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // Simulate API latency
      await new Promise((r) => setTimeout(r, 500));
      console.log('[useCreateMutation] Task created:', data);
      setSuccessMessage(`Task "${data.title}" created successfully.`);
    } catch (e) {
      setError('Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const createSchedule = useCallback(async (data: CreateScheduleFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
      console.log('[useCreateMutation] Schedule created:', data);
      setSuccessMessage(`Schedule "${data.event}" created successfully.`);
    } catch (e) {
      setError('Failed to create schedule.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { createTask, createSchedule, isSubmitting, error, successMessage };
}
