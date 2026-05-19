import { useState, useCallback } from 'react';
import type {
  ScheduleDetailDto,
  ScheduleEditFormData,
} from '../components/schedule-detail/types';

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

export interface UseScheduleDetailReturn {
  schedule: ScheduleDetailDto | null;
  isLoading: boolean;
  error: string | null;
  /** Save edited schedule fields (dummy — just updates local state). */
  updateSchedule: (data: ScheduleEditFormData) => void;
}

/**
 * Dummy hook for fetching a single schedule by ID.
 * Replace with real API integration using SchedulesApi.schedulesControllerFindOne().
 */
export function useScheduleDetail(id: string): UseScheduleDetailReturn {
  const [schedule, setSchedule] = useState<ScheduleDetailDto | null>({
    ...DUMMY_SCHEDULE_DETAIL,
    id,
  });
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const updateSchedule = useCallback(
    (data: ScheduleEditFormData) => {
      setSchedule((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          title: data.title,
          description: data.description,
          startTime: data.startTime,
          endTime: data.endTime,
          location: data.location,
          recurrenceInterval: data.recurrenceInterval,
          recurrenceCount: data.recurrenceCount,
        };
      });
    },
    [],
  );

  return { schedule, isLoading, error, updateSchedule };
}
