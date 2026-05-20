import { useState } from 'react';
import { ScheduleService } from '../services/scheduleService';
import { ScheduleDto } from '../api-client';

/** Dummy event data simulating API responses */
const DUMMY_SCHEDULES: ScheduleDto[] = [
  {
    id: 'e1',
    title: 'Strategy Review',
    description: 'Quarterly strategy alignment and review session.',
    startTime: '2024-09-04T10:00:00Z',
    endTime: '2024-09-04T11:30:00Z',
    location: 'Board Room A',
    source: 'google',
  },
  {
    id: 'e2',
    title: 'Team Standup',
    description: 'Daily engineering sync.',
    startTime: '2024-09-04T14:00:00Z',
    endTime: '2024-09-04T14:30:00Z',
    source: 'microsoft',
  },
  {
    id: 'e3',
    title: 'Product Launch',
    description: 'Coordinate product launch activities.',
    startTime: '2024-09-22T09:00:00Z',
    endTime: '2024-09-22T12:00:00Z',
    location: 'Auditorium',
    source: 'manual',
  },
];

/**
 * Fetches the list of all schedules.
 * Replace with real API call: GET /schedules
 */
export function useGetSchedules() {
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchSchedules() {
    try{
      setIsLoading(true);
      const schedules = await ScheduleService.findAll();
      setSchedules(schedules);

    }catch(err){
      setIsLoading(false)
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
      console.error("Error fetching schedules:", err);
    }
  }


  return { fetchSchedules, schedules, isLoading, error };
}
