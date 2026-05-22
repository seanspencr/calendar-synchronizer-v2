import { useState, useCallback } from 'react';
import type { CreateTaskFormData } from '../../components/create-dialog/types';

/**
 * Creates a new task.
 * Replace with real API call: POST /tasks
 */
export function useCreateTask() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createTask = useCallback(async (data: CreateTaskFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
      console.log('[useCreateTask] Task created:', data);
      setSuccessMessage(`Task "${data.title}" created successfully.`);
    } catch {
      setError('Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { createTask, isSubmitting, error, successMessage };
}
