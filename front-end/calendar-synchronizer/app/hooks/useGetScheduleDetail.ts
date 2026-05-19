import { useState } from 'react';
import type { ScheduleDetailDto } from '../components/schedule-detail/types';

/** Dummy schedule detail data simulating an API response */
const DUMMY_SCHEDULE_DETAIL: ScheduleDetailDto = {
  id: 's1',
  title: 'Executive Strategy Quarterly',
  description:
    'This session focuses on the Q4 roadmap alignment. We will review the current performance metrics against the yearly KPI targets and finalize the allocation for the upcoming innovation sprints.\n\n• Review of Q3 Market Analysis reports.\n• Finalize hiring plan for the Engineering Division.\n• Approval of 2025 Budget draft.',
  startTime: '2024-10-24T09:00:00Z',
  endTime: '2024-10-24T11:30:00Z',
  location: 'Board Room A, Floor 12',
  source: 'google',
  recurrenceInterval: 'quarterly',
  recurrenceCount: 1,
};

/**
 * Fetches a single schedule by ID.
 * Replace with real API call: GET /schedules/:id
 */
export function useGetScheduleDetail(id: string) {
  const [schedule, setSchedule] = useState<ScheduleDetailDto | null>({
    ...DUMMY_SCHEDULE_DETAIL,
    id,
  });
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  return { schedule, setSchedule, isLoading, error };
}
