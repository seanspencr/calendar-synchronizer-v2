import { useState, useCallback } from 'react';
import type { ScheduleDto } from '../components/dashboard/types';

/** Dummy schedule data simulating API responses (September 2024) */
const DUMMY_SCHEDULES: ScheduleDto[] = [
  {
    id: 's1',
    title: 'Quarterly Review',
    startTime: '2024-09-01T09:00:00Z',
    endTime: '2024-09-01T10:00:00Z',
    source: 'google',
  },
  {
    id: 's2',
    title: 'High-Stakes Pitch',
    startTime: '2024-09-03T14:00:00Z',
    endTime: '2024-09-03T15:30:00Z',
    source: 'microsoft',
  },
  {
    id: 's3',
    title: 'Strategy Hub Sync',
    startTime: '2024-09-04T10:00:00Z',
    endTime: '2024-09-04T11:00:00Z',
    source: 'google',
  },
  {
    id: 's4',
    title: 'Market Analysis',
    startTime: '2024-09-04T13:00:00Z',
    endTime: '2024-09-04T14:00:00Z',
    source: 'manual',
  },
  {
    id: 's5',
    title: 'Executive Dinner',
    startTime: '2024-09-12T19:00:00Z',
    endTime: '2024-09-12T21:00:00Z',
    source: 'microsoft',
  },
  {
    id: 's6',
    title: 'Product Launch',
    startTime: '2024-09-22T10:00:00Z',
    endTime: '2024-09-22T12:00:00Z',
    source: 'google',
  },
];

export interface UseSchedulesReturn {
  schedules: ScheduleDto[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Dummy hook for fetching schedules/events.
 * Replace with real API integration using SchedulesApi.
 */
export function useSchedules(): UseSchedulesReturn {
  const [schedules] = useState<ScheduleDto[]>(DUMMY_SCHEDULES);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = useCallback(() => {
    // In a real implementation, this would call schedulesApi.schedulesControllerFindAll()
  }, []);

  return { schedules, isLoading, error, refetch };
}
