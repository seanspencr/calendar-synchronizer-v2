import { useState, useCallback } from 'react';
import type { TaskDto } from '../components/dashboard/types';

/** Initial daily quest tasks — a subset committed for today */
const INITIAL_DAILY: string[] = ['1']; // task id '1' is initially committed

export interface UseDailyQuestReturn {
  /** IDs of tasks committed for today */
  dailyQuestIds: Set<string>;
  /** Move a task into the daily quest (commit) */
  commitTask: (id: string) => void;
  /** Remove a task from the daily quest (uncommit) */
  uncommitTask: (id: string) => void;
}

/**
 * Dummy hook for managing daily quest (today's committed tasks).
 * Tracks which task IDs are committed for the day.
 */
export function useDailyQuest(): UseDailyQuestReturn {
  const [dailyQuestIds, setDailyQuestIds] = useState<Set<string>>(
    new Set(INITIAL_DAILY),
  );

  const commitTask = useCallback((id: string) => {
    setDailyQuestIds((prev) => new Set([...prev, id]));
  }, []);

  const uncommitTask = useCallback((id: string) => {
    setDailyQuestIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return { dailyQuestIds, commitTask, uncommitTask };
}
