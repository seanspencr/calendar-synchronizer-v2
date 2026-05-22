import { useCallback } from 'react';

/**
 * Commits a task to the daily quest.
 * Replace with real API call: POST /daily-quests/:taskId
 */
export function useCommitTask(
  setDailyQuestIds: React.Dispatch<React.SetStateAction<Set<string>>>,
) {
  const commitTask = useCallback(
    (id: string) => {
      setDailyQuestIds((prev) => new Set([...prev, id]));
      // In real impl: await dailyQuestApi.commit(id)
    },
    [setDailyQuestIds],
  );

  return { commitTask };
}
