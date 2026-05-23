import { useState, useCallback } from 'react';
import type { TaskDto, UpdateTaskDto } from '../../api-client';
import { TaskService } from '../../services/taskService';

/**
 * Updates task fields.
 * Real API call: PATCH /tasks/:id
 */
export function useUpdateTask(
  setTask: React.Dispatch<React.SetStateAction<TaskDto | null>>,
  taskId?: string
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateTask = useCallback(
    async (data: UpdateTaskDto) => {
      // Snapshot previous state for rollback
      let snapshot: TaskDto | null = null;
      setTask((prev) => {
        snapshot = prev;
        if (!prev) return prev;
        return {
          ...prev,
          completed: data.completed !== undefined ? data.completed : prev.completed,
          deadline: data.deadline !== undefined ? (data.deadline as string) : prev.deadline,
          title: data.title !== undefined ? data.title : prev.title,
          description: data.description !== undefined ? (data.description as string) : prev.description,
          parent_task_id: data.parent_task_id !== undefined ? data.parent_task_id : prev.parent_task_id,
          subtasks: prev.subtasks || [],
        };
      });

      if (!taskId) return;

      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        await TaskService.updateTask(taskId, data);
        setSuccessMessage('Task updated successfully.');
      } catch (err) {
        // Roll back optimistic update
        if (snapshot !== null) setTask(snapshot);
        setError(err instanceof Error ? err.message : 'Failed to update task');
      } finally {
        setIsLoading(false);
      }
    },
    [setTask, taskId],
  );

  return { updateTask, isLoading, error, successMessage };
}
