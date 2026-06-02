import { useState, useCallback } from 'react';
import { TaskService } from '../../services/taskService';
import { TaskDto } from '@/app/api-client';

/**
 * Toggles a subtask's completion status.
 * Real API call: PATCH /tasks/:subtaskId
 */
export function useToggleSubtask(
  setTask: React.Dispatch<React.SetStateAction<TaskDto | null>>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSubtask = useCallback(
    async (subtaskId: string) => {
      // Optimistic update first
      let previousCompleted: boolean | undefined;
      setTask((prev) => {
        if (!prev) return prev;
        const subtask = prev.subtasks?.find((st) => st.id === subtaskId);
        previousCompleted = subtask?.completed;
        return {
          ...prev,
          subtasks: prev.subtasks?.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st,
          ),
        };
      });

      setIsLoading(true);
      setError(null);
      try {
        await TaskService.updateTask(subtaskId, {
          completed: previousCompleted !== undefined ? !previousCompleted : true,
        });
      } catch (err) {
        // Roll back optimistic update on failure
        setTask((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            subtasks: prev.subtasks?.map((st) =>
              st.id === subtaskId
                ? { ...st, completed: previousCompleted ?? st.completed }
                : st,
            ),
          };
        });
        setError(err instanceof Error ? err.message : 'Failed to update subtask');
      } finally {
        setIsLoading(false);
      }
    },
    [setTask],
  );

  return { toggleSubtask, isLoading, error };
}
