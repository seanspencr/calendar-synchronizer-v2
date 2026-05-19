import { useState } from 'react';
import type { TaskDetailDto } from '../components/task-detail/types';
import type { TaskDto } from '../components/dashboard/types';

/** Dummy subtask data */
const DUMMY_SUBTASKS: TaskDto[] = [
  { id: 'st-1', title: 'Review security clearance logs', completed: false, parent_task_id: 't-main' },
  { id: 'st-2', title: 'Update edge nodes', completed: true, parent_task_id: 't-main' },
  { id: 'st-3', title: 'Validate high-availability clusters', completed: false, parent_task_id: 't-main' },
];

/** Dummy task detail simulating an API response */
const DUMMY_TASK_DETAIL: TaskDetailDto = {
  id: 't-main',
  title: 'Q4 Strategic Infrastructure Review',
  description:
    'Scope of Review:\n\nComprehensive audit of the current server architecture across the EMEA region. Objectives include identifying latency bottlenecks and validating the redundancy protocols established in Q3. This task is a prerequisite for the Cloud Migration Phase 2.\n\n• Validate high-availability clusters in Frankfurt and Dublin.\n• Assess hardware lifecycle for edge nodes.\n• Review security clearance logs for tier-3 maintenance staff.\n\nNote: Coordination with the DevOps team is required for live-load testing scheduled for Friday 22:00 UTC.',
  deadline: '2024-10-24T18:00:00Z',
  created_at: '2024-09-15T08:00:00Z',
  completed: false,
  parent_task_id: 'p-1',
  parent_task_title: 'Project: Global Expansion 2025',
  subtasks: DUMMY_SUBTASKS,
};

/**
 * Fetches a single task by ID with subtasks.
 * Replace with real API call: GET /tasks/:id
 */
export function useGetTaskDetail(id: string) {
  const [task, setTask] = useState<TaskDetailDto | null>({
    ...DUMMY_TASK_DETAIL,
    id,
  });
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  return { task, setTask, isLoading, error };
}
