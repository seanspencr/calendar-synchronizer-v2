import { useState, useCallback } from 'react';
import type { TaskDto } from '../components/dashboard/types';

/** Dummy task data simulating API responses */
const DUMMY_TASKS: TaskDto[] = [
  {
    id: '1',
    title: 'Refine Q4 Projections',
    description: 'Validate performance metrics with data science lead before quarterly review.',
    deadline: '2024-09-15T17:00:00Z',
    created_at: '2024-09-01T08:00:00Z',
    completed: false,
    parent_task_id: null,
  },
  {
    id: '2',
    title: 'Hiring: Principal Architect',
    description: 'Review final three candidates for the strategic infrastructure role.',
    deadline: '2024-09-20T17:00:00Z',
    created_at: '2024-09-02T10:00:00Z',
    completed: false,
    parent_task_id: null,
  },
  {
    id: '3',
    title: 'Stakeholder Presentation',
    description: 'Finalize the visual narrative for the board deck regarding Q3 results.',
    deadline: '2024-09-18T12:00:00Z',
    created_at: '2024-09-03T09:00:00Z',
    completed: false,
    parent_task_id: null,
  },
  {
    id: '4',
    title: 'Vendor Audit',
    description: 'Annual review of cloud infrastructure costs and service-level agreements.',
    deadline: '2024-09-25T17:00:00Z',
    created_at: '2024-09-04T14:00:00Z',
    completed: false,
    parent_task_id: null,
  },
];

export interface UseTasksReturn {
  tasks: TaskDto[];
  isLoading: boolean;
  error: string | null;
  toggleTask: (id: string) => void;
  refetch: () => void;
}

/**
 * Dummy hook for fetching and managing tasks.
 * Replace with real API integration using TasksApi.
 */
export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<TaskDto[]>(DUMMY_TASKS);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const refetch = useCallback(() => {
    // In a real implementation, this would call tasksApi.tasksControllerFindAll()
    setTasks(DUMMY_TASKS);
  }, []);

  return { tasks, isLoading, error, toggleTask, refetch };
}
