/**
 * Dashboard-specific types derived from the OpenAPI generated DTOs.
 * These extend the Create DTOs with fields typically present in API responses (e.g. id).
 */

// Re-export the create DTOs for convenience
export type { CreateTaskDto } from '../../api-client/api';

/** A schedule/event as returned by the API */
export interface ScheduleDto {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  location?: string;
  source?: 'google' | 'microsoft' | 'manual';
}

/** A task as returned by the API */
export interface TaskDto {
  id: string;
  title: string;
  description?: string;
  deadline?: string;    // ISO date string
  created_at?: string;  // ISO date string
  completed: boolean;
  parent_task_id?: string | null;
}

/** User profile info used by the sidebar header */
export interface UserProfile {
  userid: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

/** A single chat message for the chatbot */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
