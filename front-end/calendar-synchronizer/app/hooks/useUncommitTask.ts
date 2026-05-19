import { useCallback } from 'react';

/**
 * Uncommits a task from the daily quest.
 * Replace with real API call: DELETE /daily-quests/:taskId
 */
export function useUncommitTask(
  setDailyQuestIds: React.Dispatch<React.SetStateAction<Set<string>>>,
) {
  const uncommitTask = useCallback(
    (id: string) => {
      setDailyQuestIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      // In real impl: await dailyQuestApi.uncommit(id)
    },
    [setDailyQuestIds],
  );

  return { uncommitTask };
}
