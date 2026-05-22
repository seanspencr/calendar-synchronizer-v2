import { useCallback } from 'react';
import type { TaskDto } from '../../api-client';
import { TaskService } from '../../services/taskService';

/**
 * Toggles the completion status of a task.
 * Real API call: PATCH /tasks/:id
 */
export function useToggleTask(
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>,
) {
  const toggleTask = useCallback(
    (id: string) => {
      // Optimistic update
      setTasks((prev) => {
        const taskToToggle = prev.find((task) => task.id === id);
        if (taskToToggle) {
          TaskService.updateTask(id, { completed: !taskToToggle.completed }).catch(console.error);
        }
        return prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        );
      });
    },
    [setTasks],
  );

  return { toggleTask };
}
