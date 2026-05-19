import { useCallback } from 'react';
import type { TaskDetailDto } from '../components/task-detail/types';

/**
 * Toggles a subtask's completion status.
 * Replace with real API call: PATCH /tasks/:subtaskId
 */
export function useToggleSubtask(
  setTask: React.Dispatch<React.SetStateAction<TaskDetailDto | null>>,
) {
  const toggleSubtask = useCallback(
    (subtaskId: string) => {
      // Optimistic update
      setTask((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          subtasks: prev.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st,
          ),
        };
      });
      // In real impl: await tasksApi.tasksControllerToggle(subtaskId)
    },
    [setTask],
  );

  return { toggleSubtask };
}
