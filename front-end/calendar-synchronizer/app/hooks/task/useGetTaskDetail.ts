import { useState, useEffect } from 'react';
import type { TaskDto } from '../../api-client';
import { TaskService } from '../../services/taskService';

/**
 * Fetches a single task by ID with subtasks.
 * Real API call: GET /tasks/:id
 */
export function useGetTaskDetail(id: string) {
  const [task, setTask] = useState<TaskDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    async function fetchTask() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await TaskService.findOne(id);
        // Map TaskDto from API to TaskDetailDto for UI (mocking empty subtasks array if needed)
        setTask(data);
        
      } catch (err) {
        console.error(err);
        setError('Failed to fetch task detail');
        
      } finally {
        setIsLoading(false);
      }
    }
    fetchTask();
  }, [id]);

  return { task, setTask, isLoading, error };
}
