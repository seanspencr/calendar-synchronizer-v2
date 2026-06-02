import { useState, useCallback } from 'react';
import type { CreateTaskFormData } from '../../components/create-dialog/types';
import { TaskService } from '@/app/services/taskService';
import { CreateTaskDto } from '@/app/api-client';
import { TaskDto } from '@/app/api-client';

/**
 * Creates a new task.
 * Replace with real API call: POST /tasks
 */
export function useCreateTask(
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createTask = useCallback(async (data: CreateTaskFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const deadlineIso = data.deadline ? new Date(data.deadline).toISOString() : undefined;
      const task = await TaskService.createTask({
        title: data.title,
        description: data.description,
        deadline: deadlineIso,
        completed: false,
        parent_task_id: data.parent_task_id,
      });
      setTasks((prev) => [...prev, task].sort((a, b) => {
        const dateA = a.deadline ? new Date(a.deadline) : new Date(0);
        const dateB = b.deadline ? new Date(b.deadline) : new Date(0);
        return dateA.getTime() - dateB.getTime();
      }));
      setSuccessMessage(`Task "${data.title}" created successfully.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { createTask, isSubmitting, error, successMessage };
}
