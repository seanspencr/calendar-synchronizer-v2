/**
 * Types for the Task Detail page.
 * Extends the base TaskDto with subtasks and resolved parent task name.
 */

import type { TaskDto } from '../dashboard/types';

/** Extended task with subtasks for the detail view */
export interface TaskDetailDto extends TaskDto {
  subtasks: TaskDto[];
  parent_task_title?: string | null;
}

/** Editable fields exposed by the task edit form */
export interface TaskEditFormData {
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
}
