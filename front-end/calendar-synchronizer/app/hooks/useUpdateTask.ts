import { useCallback } from 'react';
import type { TaskDetailDto } from '../components/task-detail/types';
import type { TaskEditFormData } from '../components/task-detail/types';

/**
 * Updates task fields.
 * Replace with real API call: PUT /tasks/:id
 */
export function useUpdateTask(
  setTask: React.Dispatch<React.SetStateAction<TaskDetailDto | null>>,
) {
  const updateTask = useCallback(
    (data: TaskEditFormData) => {
      // Optimistic update
      setTask((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          title: data.title,
          description: data.description,
          deadline: data.deadline,
          completed: data.completed,
        };
      });
      // In real impl: await tasksApi.tasksControllerUpdate(id, data)
    },
    [setTask],
  );

  return { updateTask };
}
