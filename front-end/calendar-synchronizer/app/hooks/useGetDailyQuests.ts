import { useState } from 'react';

/**
 * Fetches the set of task IDs committed as daily quests.
 * Replace with real API call: GET /daily-quests
 */
export function useGetDailyQuests() {
  const [dailyQuestIds, setDailyQuestIds] = useState<Set<string>>(
    new Set(['1']),
  );

  return { dailyQuestIds, setDailyQuestIds };
}
