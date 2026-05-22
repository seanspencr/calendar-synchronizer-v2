import { useCallback } from 'react';
import type { TaskDto, UpdateTaskDto } from '../../api-client';
import { TaskService } from '../../services/taskService';

/**
 * Updates task fields.
 * Real API call: PUT /tasks/:id
 */
export function useUpdateTask(
  setTask: React.Dispatch<React.SetStateAction<TaskDto | null>>,
  taskId?: string
) {
  const updateTask = useCallback(
    (data: UpdateTaskDto) => {
      // Optimistic update
      setTask((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          completed: data.completed !== undefined ? data.completed : prev.completed,
          deadline: data.deadline !== undefined ? data.deadline : prev.deadline,
          title: data.title !== undefined ? data.title : prev.title,
          description: data.description !== undefined ? data.description : prev.description,
          parent_task_id: data.parent_task_id !== undefined ? data.parent_task_id : prev.parent_task_id,
          subtasks: prev.subtasks || []
        };
      });

      if (taskId) {
        TaskService.updateTask(taskId, data).catch(console.error);
      }
    },
    [setTask, taskId],
  );

  return { updateTask };
}
