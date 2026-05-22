import { useState, useCallback } from 'react';
import type { TaskDto } from '../../api-client';
import { TaskService } from '../../services/taskService';

/**
 * Toggles the completion status of a task.
 * Real API call: PATCH /tasks/:id
 */
export function useToggleTask(
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTask = useCallback(
    async (id: string) => {
      // Optimistic update
      let previousCompleted: boolean | undefined;
      setTasks((prev) => {
        const task = prev.find((t) => t.id === id);
        previousCompleted = task?.completed;
        return prev.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t,
        );
      });

      setIsLoading(true);
      setError(null);
      try {
        await TaskService.updateTask(id, {
          completed: previousCompleted !== undefined ? !previousCompleted : true,
        });
      } catch (err) {
        // Roll back on failure
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, completed: previousCompleted ?? t.completed }
              : t,
          ),
        );
        setError(err instanceof Error ? err.message : 'Failed to update task');
      } finally {
        setIsLoading(false);
      }
    },
    [setTasks],
  );

  return { toggleTask, isLoading, error };
}
