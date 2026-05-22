import { useCallback } from 'react';
import type { TaskDetailDto } from '../../components/task-detail/types';
import { TaskService } from '../../services/taskService';

/**
 * Toggles a subtask's completion status.
 * Real API call: PATCH /tasks/:subtaskId
 */
export function useToggleSubtask(
  setTask: React.Dispatch<React.SetStateAction<TaskDetailDto | null>>,
) {
  const toggleSubtask = useCallback(
    (subtaskId: string) => {
      // Optimistic update
      setTask((prev) => {
        if (!prev) return prev;

        const subtaskToToggle = prev.subtasks.find((st) => st.id === subtaskId);
        if (subtaskToToggle) {
          TaskService.updateTask(subtaskId, { completed: !subtaskToToggle.completed }).catch(console.error);
        }

        return {
          ...prev,
          subtasks: prev.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st,
          ),
        };
      });
    },
    [setTask],
  );

  return { toggleSubtask };
}
