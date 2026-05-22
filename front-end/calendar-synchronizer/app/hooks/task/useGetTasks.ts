import { useState } from 'react';
import type { TaskDto } from '../../api-client';
import { TaskService } from '@/app/services/taskService';

/**
 * Fetches the list of all tasks.
 * Replace with real API call: GET /tasks
 */
export function useGetTasks() {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(){
    setLoading(true);
    setError(null);

    try {
      let tasks = await TaskService.findAll();
      setTasks(tasks);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }

  return { tasks, setTasks, isLoading, error , fetch};
}
