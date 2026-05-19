import { useCallback } from 'react';
import type { TaskDto } from '../components/dashboard/types';

/**
 * Toggles the completion status of a task.
 * Replace with real API call: PATCH /tasks/:id
 */
export function useToggleTask(
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>,
) {
  const toggleTask = useCallback(
    (id: string) => {
      // Optimistic update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        ),
      );
      // In real impl: await tasksApi.tasksControllerToggle(id)
    },
    [setTasks],
  );

  return { toggleTask };
}
